"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
const Design = () => {
  const { user } = useUser();
  const [wireframeList, setWireframeList] = useState([]);
  useEffect(() => {
    if (user) {
      GetAllUserWireframe();
    }
  }, [user]);

  const GetAllUserWireframe = async () => {


    
  };
  return <div>Design</div>;
};

export default Design;
