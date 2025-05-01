import AppHeader from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextFrame",
  description: "Convert your Images into Code",
  icons: {
    icon: "nextframe-logo-2.svg",
  },
};
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <main className="flex flex-col h-screen w-screen">
        {" "}
        {/* Changed to h-screen */}
        <AppHeader />
        <div className="flex flex-1 overflow-hidden">
          {" "}
          {/* Added overflow-hidden */}
          <AppSidebar />
          <section className="flex-1 flex flex-col px-6 pb-6 pt-10 max-md:pb-14 sm:px-14 overflow-y-auto">
            <div className="w-full max-w-[1800px] mx-auto">{children}</div>
          </section>
        </div>
      </main>
    </SidebarProvider>
  );
}
