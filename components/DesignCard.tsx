import Image from "next/image";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { Code } from "lucide-react";
import { AImodels } from "@/constants/AImodels";

const DesignCard = ({ item, docId }: any) => {
  const modObj = item && AImodels.find((mod: any) => mod.name === item.model);

  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader className="p-0">
        <Image
          src={item?.imageUrl}
          alt="image"
          width={300}
          height={200}
          className="w-full h-[200px] object-cover bg-white"
        />
      </CardHeader>

      <CardContent className="px-4 pt-3">
        <p className="line-clamp-3 text-gray-500 text-sm">
          {item?.description}
        </p>
      </CardContent>

      <CardFooter className="px-4 pb-4 flex justify-between items-center">
        <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-full">
          {modObj && (
            <Image
              src={modObj.icon}
              alt={modObj.modelName ?? ""}
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <span className="text-sm text-gray-800">{modObj?.name}</span>
        </div>
        <Link href={`/view-code/${item?.uid}?docId=${docId}&source=designCard`}>
          <Button size="sm">
            <Code className="w-4 h-4 mr-2" /> View Code
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DesignCard;
