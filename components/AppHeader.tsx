import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";

function AppHeader({ hideSideBar = false }) {
  return (
    <div className="p-5 shadow-sm flex justify-between w-full bg-dark-3 z-50">
      {" "}
      {/* Added z-50 */}
      {/* <div className="z-50"> */} {/* Added z-index */}
      {!hideSideBar && (
        <SidebarTrigger className="text-white h-10 w-10 md:hidden" />
      )}
      {/* Show only on mobile */}
      {/* </div> */}
      <div className="md:ml-auto">
        <UserButton />
      </div>
    </div>
  );
}

export default AppHeader;
