import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppAuthProvider } from "@/components/auth-provider";
import { MotionEnhancements } from "@/components/motion-enhancements";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MeritLab | Prepare Smarter. Score Higher.",
    template: "%s | MeritLab",
  },
  description:
    "A structured preparation platform for students working toward the NUST Entry Test.",
  applicationName: "MeritLab",
  verification: {
    google: "BTj1Iv-tegwh1mDm6qHsMNDwgsbNyuKDeh0FjWA7DcQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppAuthProvider>
          {children}
          <MotionEnhancements />
        </AppAuthProvider>
      </body>
    </html>
  );
}
