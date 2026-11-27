import type { Metadata } from "next";

export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://meritlab.entrytests.workers.dev",
);
export const SITE_NAME = "MeritLab";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  indexable?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  indexable = true,
}: PageMetadataInput): Metadata {
  const url = new URL(path, SITE_URL);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      locale: "en_PK",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    twitter: {
      card: "summary",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    ...(indexable ? {} : { robots: { index: false, follow: true } }),
  };
}
