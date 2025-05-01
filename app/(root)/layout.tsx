import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextFrame",
  description: "Convert your Images into Code",
  icons: {
    icon: "/icons/nextframe-logo.svg",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
