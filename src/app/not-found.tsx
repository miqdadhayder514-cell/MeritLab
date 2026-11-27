import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <SiteShell isPublic>
      <main className="wrap seo-not-found">
        <p className="eyebrow">404 · PAGE NOT FOUND</p>
        <h1>We couldn’t find that page.</h1>
        <p>
          The link may be outdated, or the page may have moved. Start with the NUST
          preparation guide or return to MeritLab’s home page.
        </p>
        <div className="seo-related-links">
          <a className="button button-primary" href="/nust-entry-test-preparation">
            Read the NUST preparation guide
          </a>
          <a href="/">Go to MeritLab home</a>
        </div>
      </main>
    </SiteShell>
  );
}
