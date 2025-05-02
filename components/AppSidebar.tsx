"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {  DollarSignIcon, Home, PaletteIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Workspace",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Designs",
    url: "/designs",
    icon: PaletteIcon,
  },
  {
    title: "Credits",
    url: "/credits",
    icon: DollarSignIcon,
  },
];
export function AppSidebar() {
  const path = usePathname();
  return (
    <Sidebar className="bg-[#18181B] border-none h-[100dvh] w-[264px] fixed left-0 top-0 flex flex-col justify-between p-6 pt-2 text-white max-sm:hidden">
      <SidebarHeader className="bg-[#18181B] pt-20">
        <div className="p-4">
          <Image
            src={"./nextframe-logo-2.svg"}
            alt="logo"
            width={100}
            height={100}
            className="w-full h-full"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#18181B] flex-1 overflow-y-auto">
        {" "}
        {/* Added overflow */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {" "}
              {/* Changed to space-y */}
              {items.map((item, index) => (
                <Link
                  href={item.url}
                  key={index}
                  className={`p-3 flex gap-5 items-center text-base font-medium text-white
                    rounded-lg ${
                      item.url === path ? "bg-gray-700" : "hover:bg-gray-800"
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* 
      <SidebarFooter className="border-t border-gray-800 pt-4"></SidebarFooter> */}
    </Sidebar>
  );
}
