"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { toast } from "sonner";
import DesignCard from "@/components/DesignCard";

const Design = () => {
  const { user } = useUser();
  const [wireframeList, setWireframeList] = useState<any[]>([]);

  const GetAllUserWireframe = async () => {
    const email = user?.emailAddresses[0]?.emailAddress;
    if (!email) {
      console.error("User email is undefined");
      toast.error("User email is undefined");
      return;
    }
    if (!user) return <div>Loading...</div>;

    try {
      const wireframesRef = collection(db, "users", email, "wireframes");
      // const userDocSnap = await getDoc(userDocRef);
      const wireframesSnap = await getDocs(wireframesRef);
      console.log("wireframe snapshot:", wireframesSnap);
      // if (userDocSnap.exists()) {
      //   const data = userDocSnap.data();
      //   console.log("Document data:", data);
      //   //pushing all the wireframes
      //   setWireframeList(data.wireframes || []);
      // } else {
      //   console.log("No such document!");
      //   toast.error("No Such document!");
      // }
      const wireframes = wireframesSnap.docs.map((doc) => ({
        ...doc.data(),
        docId: doc.id, // Add the document ID to each wireframe
      }));
      console.log("Fetched wireframes:", wireframes);
      setWireframeList(wireframes);
    } catch (error) {
      console.error("Error fetching wireframes:", error);
      toast.error("Error fetching wireframes");
    }
  };

  useEffect(() => {
    if (user) {
      GetAllUserWireframe();
    }
  }, [user]);
  console.log("wireframeList before return:", wireframeList);
  return (
    <div>
      <h2 className="font-bold text-3xl text-white">Your Wireframe & Codes</h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-7 mt-10">
        {wireframeList.map(
          (item, index: any) =>
            item.code && (
              <DesignCard key={index} item={item} docId={item.docId} />
            )
        )}
      </div>
    </div>
  );
};

export default Design;
