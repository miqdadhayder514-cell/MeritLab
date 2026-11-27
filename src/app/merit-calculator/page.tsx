import type { Metadata } from "next";
import { MeritCalculatorPage } from "@/components/merit-calculator-page";
import { SiteShell } from "@/components/site-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "University Merit Calculator for Pakistan",
  description:
    "Estimate and compare Pakistani university admission aggregates with MeritLab’s university merit calculator.",
  path: "/merit-calculator",
});

export default function MeritCalculatorRoute() {
  return (
    <SiteShell isPublic>
      <MeritCalculatorPage />
    </SiteShell>
  );
}
