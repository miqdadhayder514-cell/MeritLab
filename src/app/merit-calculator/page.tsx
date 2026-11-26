import type { Metadata } from "next";
import { MeritCalculatorPage } from "@/components/merit-calculator-page";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "University Merit Calculator",
  description:
    "Calculate and compare Pakistani university admission aggregates using verified official merit criteria.",
};

export default function MeritCalculatorRoute() {
  return (
    <SiteShell isPublic>
      <MeritCalculatorPage />
    </SiteShell>
  );
}
