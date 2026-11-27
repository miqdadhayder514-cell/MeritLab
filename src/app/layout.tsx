import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppAuthProvider } from "@/components/auth-provider";
import { MotionEnhancements } from "@/components/motion-enhancements";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NUST Entry Test Preparation | MeritLab",
    template: "%s | MeritLab",
  },
  description:
    "Prepare for the NUST Entry Test with a clear study plan, focused practice, and mock-test tools from MeritLab.",
  applicationName: "MeritLab",
  metadataBase: SITE_URL,
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_PK",
  },
  twitter: {
    card: "summary",
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
        <script type="application/ld+json">
          {JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL.toString(),
              description:
                "An independent educational platform helping students prepare for the NUST Entry Test.",
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL.toString(),
              description:
                "Study guidance and preparation tools for students working toward the NUST Entry Test.",
              inLanguage: "en-PK",
            },
          ]).replace(/</g, "\\u003c")}
        </script>
        <AppAuthProvider>
          {children}
          <MotionEnhancements />
        </AppAuthProvider>
      </body>
    </html>
  );
}
