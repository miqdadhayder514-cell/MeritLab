# MeritLab initial SEO audit

Audit date: 2026-11-27

This records the pre-implementation state found in the repository. It is a
technical/content review, not a ranking or traffic report; no Search Console,
Analytics, Lighthouse, or server-log access was available.

## Prioritized findings

### P0 — Resolve before publishing crawl-facing SEO

- **Canonical production origin was not defined in the repository.** Without a
  single origin, canonical links and an absolute sitemap could point at a
  development host or the wrong domain.
- **Search-facing route inventory was mixed with authenticated app routes.**
  `/mock-tests`, `/past-papers`, `/practice`, and student workspaces are routed
  through the catch-all and several require sign-in. These should not be
  represented as public landing pages or included in a sitemap.
- **Important product claims were inconsistent with the implementation.** The
  landing FAQ and About page described all accounts and records as frontend-only,
  while Supabase authentication/profile features exist. Some practice results
  and learning analytics are still session-based or demonstrative.

### P1 — High-impact discoverability improvements

- The root layout had a generic site title/description. Only the home page and
  merit calculator had page metadata; catch-all pages had no distinct route
  metadata, canonical, Open Graph, or Twitter cards.
- No `robots.txt` or XML sitemap was present. A custom branded 404 was also
  absent.
- MeritLab had no substantial, standalone public guide targeting the central
  NUST NET preparation intent. Homepage content was promotional, and the main
  practice/test routes require authentication.
- No structured data was present. Organization, WebSite, Article, and
  BreadcrumbList are appropriate for the implemented pages; Course, ratings,
  and FAQ rich-result markup are not justified by the current product/content.
- Generic FAQ, privacy, and terms routes were placeholders. They should not be
  promoted as substantive search landing pages until their visible content is
  completed.

### P2 — Performance, UX, and measurement

- The site uses Next.js App Router and server route handling with client-side
  interactive components. Public page text is server-rendered, but several
  shared client components and authentication context add hydration work.
- The project has no raster image assets or custom web fonts to optimize; major
  illustrations are CSS/SVG. Existing asset headers cache immutable Next.js
  static files.
- The checked-in code supports reduced-motion preferences in CSS and the
  motion component. No real-device Core Web Vitals or Lighthouse measurements
  were available, so performance claims require field/lab validation.
- Several primary navigation links lead to routes that prompt for sign-in.
  Their labels should remain clear about account requirements, and public
  informational resources should be linked independently.

## Search intent and keyword mapping

A qualitative Google results-page check on 2026-11-27 for “NUST entry test
preparation online Pakistan” showed preparation platforms offering timed NET
practice and explanations, downloadable notes/past-paper resources, and an
official NUST computer-based sample. A second query around “NUST NET syllabus
official past papers Pakistan” surfaced past-paper/resource pages and the
official admissions source. These observations indicate mixed intent:
preparation guidance, practice material, syllabus/source verification, and
past-paper discovery. Results are personalized and volatile; this audit makes
no search-volume or ranking-difficulty claims.

| Page | Primary intent / keyword cluster | Decision |
|---|---|---|
| `/` | NUST Entry Test preparation; NUST NET preparation | Main product entry page; distinct title, H1, and guide link |
| `/nust-entry-test-preparation` | NUST NET preparation online; how to prepare for NUST NET | One substantial guide combining study planning, subject techniques, and mock-test advice |
| `/merit-calculator` | Pakistani university merit calculator | Existing tool with unique metadata |
| `/pricing` | MeritLab plans / NET preparation tools | Product conversion page; retain, with unique metadata |
| `/about` | MeritLab brand and trust | Public brand page; correct inaccurate implementation claims |
| Subject-specific MCQs, syllabus, and past-paper pages | Physics/Maths/Chemistry/CS/English MCQs; NUST syllabus; past papers | Do not publish thin or inaccessible keyword pages. Build only when distinct public content/tools are ready and verified |
| FAST, COMSATS, UET preparation | Other university admission tests | Defer until MeritLab has genuinely useful, researched resources for those exams |

No search volumes are asserted. Use Google Search Console query and landing-page
data after the property is connected to refine this map.

## Crawlability and content constraints

- Public indexable routes should have unique metadata, absolute canonicals, and
  server-rendered visible text.
- Authenticated/personalized routes should be `noindex` and excluded from the
  sitemap without changing their access controls.
- Official NUST admission requirements, dates, eligibility, and test rules
  must link to current NUST sources. MeritLab study suggestions must be clearly
  identified as guidance, not official policy.
- Current learning/practice content is uneven; avoid claims that every subject
  has an available public question bank or that memory-based material is
  official.
