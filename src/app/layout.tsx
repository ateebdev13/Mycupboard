import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "MetaLogics — Building AI Products that Reduce Costs",
  description: "One team for your entire product from first strategy call to the final launch.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
