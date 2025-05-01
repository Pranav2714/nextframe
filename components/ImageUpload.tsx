"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AImodels } from "@/constants/AImodels";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2Icon, Upload, WandSparkles, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const ImageUpload = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const { user } = useUser();
  const router = useRouter();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setFile(files[0]); // store the actual file
      setSelectedFile(files[0]);
      const imgUrl = URL.createObjectURL(files[0]);
      console.log("File is", file);
      setPreviewUrl(imgUrl);
    }
  };

  const OnConverToCodeButtonClick = async () => {
    if (!selectedFile || !selectedModel || !description) {
      console.log("Please select all fields");
      toast.warning("Please select all fields");
      return;
    }
    //Save image to cloudinary
    setLoading(true);
    try {
      //cloudinary uplosd
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );
      formData.append(
        "cloud_name",
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
      );

      const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const imgUrl = data.secure_url;
      console.log("Image uploaded to Cloudinary:", imgUrl);
      // TODO: Save `imageUrl`, `description`, `selectedModel` to your database

      const email = user?.emailAddresses?.[0]?.emailAddress;

      if (!email) {
        toast.error("User email is missing.");
        console.error("User email is missing.");
        return;
      }

      const userDocRef = doc(db, "users", email);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          email: email,
          createdAt: new Date(),
          
        });
      }

      const wireframesCollection = collection(userDocRef, "wireframes");
      const uid = crypto.randomUUID();
      const docRef = await addDoc(wireframesCollection, {
        uid: uid,
        imageUrl: imgUrl,
        model: selectedModel,
        description: description,
        code: null,
        createdAt: new Date(),
        createdBy: email,
      });
      const wireframeId = docRef.id;
      router.push(`/view-code/${uid}?docId=${wireframeId}`);
    } catch (error) {
      console.error("Error uploading image or saving data", error);
      toast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <div className="grid lg:grid-cols-2 gap-20 md:rid-cols-1">
        {!previewUrl ? (
          <div className=" border border-dashed p-20 rounded-md shadow-md flex flex-col justify-center items-center bg-dark-4">
            <Upload className="h-10 w-10 text-white" />
            <h2 className="font-bold text-lg text-white">Upload Image</h2>
            <p className="text-gray-400 mt-3">
              Click on the button to select the wireframe image
            </p>
            <div className="p-3 mt-2">
              <label
                htmlFor="imgUpload"
                className="bg-purple-1 hover:bg-purple-2 text-white  rounded-lg cursor-pointer  p-2 font-semibold"
              >
                Select Image
              </label>
            </div>
            <input
              type="file"
              id="imgUpload"
              hidden
              multiple={false}
              onChange={handleImageSelect}
            />
          </div>
        ) : (
          <div className="relative border border-dashed p-7 rounded-md shadow-md">
            <X
              className="absolute top-2 right-2 cursor-pointer text-white"
              onClick={() => {
                setPreviewUrl(null);
                setSelectedFile(null);
              }}
            />
            <Image
              src={previewUrl}
              width={500}
              height={500}
              alt="Preview Image"
              className="w-full h-[300px] object-contain"
            />
          </div>
        )}
        <div className="border border-dotted p-10 relative rounded-md shadow-md flex flex-col justify-center bg-gary-400 ">
          <h2 className="text-md font-bold text-white">Select your AI model</h2>
          <Select onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full mt-3 bg-gray-300">
              <SelectValue placeholder="Select your model" />
            </SelectTrigger>

            <SelectContent className="bg-gray-400  text-black">
              {AImodels.map((model, index) => (
                <SelectItem
                  key={index}
                  value={model.name}
                  className="text-black "
                >
                  <div
                    key={index}
                    className="flex gap-3 font-normal  text-black"
                  >
                    <Image
                      src={model.icon}
                      height={20}
                      width={20}
                      alt={model.name}
                    />
                    {model.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <h2 className=" font-bold text-md mt-3 text-white">
            Describe your webpage
          </h2>
          <Textarea
            className="border-gray-500 h-[150px] mt-3 bg-gray-300"
            placeholder="Write about your webpage"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-10 flex items-center justify-center">
        <Button
          onClick={OnConverToCodeButtonClick}
          disabled={loading}
          className="bg-purple-1 hover:bg-purple-2 cursor-pointer"
        >
          {loading ? (
            <Loader2Icon className=" animate-spin" />
          ) : (
            <WandSparkles />
          )}
          Convert to Code
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
