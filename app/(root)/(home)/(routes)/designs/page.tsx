"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import DesignCard from "@/components/DesignCard";

const Design = () => {
  const { user } = useUser();
  const [wireframeList, setWireframeList] = useState([]);
  const GetAllUserWireframe = async () => {
    const email = user?.emailAddresses[0]?.emailAddress;
    if (!email) {
      console.error("User email is undefined");
      toast.error("User email is undefined");
      return;
    }
    try {
      const userDocRef = doc(db, "users", email);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        //pushing all the wireframes
        setWireframeList(data.wireframes || []);
      } else {
        console.log("No such document!");
        toast.error("No Such document!");
      }
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

  return (
    <div>
      <h2 className="font-bold text-3xl text-white">Wireframe & Codes</h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-7 mt-10">
        {wireframeList.map(
          (item: any, index) =>
            item.code && <DesignCard key={index} item={item} />
        )}
      </div>
    </div>
  );
};

export default Design;
