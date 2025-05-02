import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import {  ChevronLeftSquare, HomeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function AppHeader({ hideSideBar = false }) {
  return (
    <div className="p-5 shadow-sm flex items-center gap-4 w-full bg-dark-3 z-50">
      <div className="flex items-center gap-4 flex-1">
        {/* Home Icon and Sidebar Trigger Group */}
        <div className="flex items-center gap-4">
          {!hideSideBar && (
            <SidebarTrigger className="text-white h-8 w-8 p-1.5 hover:bg-gray-700 rounded-md transition-colors md:hidden">
              <ChevronLeftSquare className="h-full w-full" />
            </SidebarTrigger>
          )}
          <Link href={"/"} className="hover:opacity-80 transition-opacity">
            <HomeIcon className="text-white h-7 w-7" />
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Button */}
        <div className="md:ml-auto">
          <UserButton />
        </div>
      </div>
    </div>
  );
}

export default AppHeader;
