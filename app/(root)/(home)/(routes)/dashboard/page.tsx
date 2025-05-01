import ImageUpload from "@/components/ImageUpload";
import React from "react";

const dashboard = () => {
  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold text-white">
        Convert Wireframe to Code
      </h1>
      <p className="text-gray-500 text-sm mt-2">
        Convert your wireframe to code in seconds. Just upload your design and
        get the code.
      </p>
      <ImageUpload />
    </div>
  );
};

export default dashboard;
