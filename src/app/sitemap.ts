import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/nust-entry-test-preparation",
    "/about",
    "/pricing",
    "/merit-calculator",
  ].map((path) => ({
    url: new URL(path, SITE_URL).toString(),
  }));
}
