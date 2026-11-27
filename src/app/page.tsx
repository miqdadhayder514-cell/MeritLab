import { LandingPage } from "@/components/landing-page";
import { SiteShell } from "@/components/site-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "NUST Entry Test Preparation & NET Practice",
  description:
    "Plan your NUST NET preparation with subject-focused study guidance, practice tools, and mock-test resources for Pakistani students.",
  path: "/",
});

export default function Home() {
  return (
    <SiteShell isPublic>
      <LandingPage />
    </SiteShell>
  );
}
