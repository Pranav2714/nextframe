"use client";

import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import AiPrompts from "@/constants/AiPrompts";
import SelectionDetail from "@/components/SelectionDetail";
import CodeEditor from "@/components/CodeEditor";
import AppHeader from "@/components/AppHeader";

const ViewCode = () => {
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  const { user } = useUser();
  const params = useSearchParams();
  const uid = params.get("uid");
  const docId = params.get("docId");

  // console.log("params uid:", uid, "params docId:", docId);

  useEffect(() => {
    // console.log("useEffect triggered");
    // console.log("uid:", uid, "docId:", docId, "user:", user);
    const fetchAndGenerateCode = async () => {
      if (!docId || !user) return;

      const email = user.emailAddresses[0].emailAddress;
      const docRef = doc(db, "users", email, "wireframes", docId);

      try {
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          toast.error("Document not found.");
          return;
        }

        const data = docSnap.data();
        // console.log("Fetched record:", data);
        setRecord(data);

        // If code already exists
        if (data.code) {
          setCode(data.code);
          setLoading(false);
          setIsReady(true);
          return;
        }

        // Generate Code via API
        const response = await fetch("/api/ai-model", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: data.imageUrl,
            description: data.description + ":" + AiPrompts.PROMPT,
            model: data.model,
          }),
        });

        if (!response.ok || !response.body) {
          const errText = await response.text();
          throw new Error(errText || "Code generation failed");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullCode = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder
            .decode(value)
            .replace("```jsx", "")
            .replace("```javascript", "")
            .replace("javascript", "")
            .replace("jsx", "")
            .replace("```", "");
          fullCode += chunk;

          setCode((prev) => (prev ?? "") + chunk);
        }

        await updateDoc(docRef, { code: fullCode });
        setIsReady(true);
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong during code generation.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndGenerateCode();
  }, [uid, docId, user]);

  const regenerateCode = async () => {
    if (!record || !docId || !user) return;
    setCode(null);
    setLoading(true);
    setIsReady(false);

    const email = user.emailAddresses[0].emailAddress;
    const docRef = doc(db, "users", email, "wireframes", docId);

    try {
      const response = await fetch("/api/ai-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: record.imageUrl,
          description: record.description + ":" + AiPrompts.PROMPT,
          model: record.model,
        }),
      });

      if (!response.ok || !response.body) {
        const errText = await response.text();
        throw new Error(errText || "Code generation failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullCode = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder
          .decode(value)
          .replace("```jsx", "")
          .replace("```javascript", "")
          .replace("javascript", "")
          .replace("jsx", "")
          .replace("```", "");
        fullCode += chunk;

        setCode((prev) => (prev ?? "") + chunk);
      }

      await updateDoc(docRef, { code: fullCode });
      setIsReady(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during regeneration.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <AppHeader hideSideBar={true} />
      <div className="grid grid-cols-1 md:grid-cols-5 p-5 gap-10">
        <div>
          <SelectionDetail
            record={record}
            isReady={isReady}
            regenrateCode={regenerateCode}
          />
        </div>
        <div className="col-span-4">
          {loading ? (
            <div className="font-bold text-2xl text-center p-20 flex items-center justify-center bg-slate-100 h-[80vh] rounded-xl">
              <Loader2 className="animate-spin mr-2" />
              Analyzing the Wireframe...
            </div>
          ) : (
            <CodeEditor codeResp={code ?? ""} isReady={isReady} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCode;
