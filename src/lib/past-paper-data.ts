import type { ExamQuestion, ExamTest } from "./exam-types";
import net1Dec2026 from "./past-paper-tests/nust-engineering-net-1-09-dec-2026.json";
import net1Nov2026 from "./past-paper-tests/nust-engineering-net-1-26-nov-2026.json";
import net1_2025 from "./past-paper-tests/nust-engineering-net-1-2025.json";
import net1_2026 from "./past-paper-tests/nust-engineering-net-1-2026.json";
import net2Feb09 from "./past-paper-tests/nust-engineering-net-2-09-feb-2025.json";
import net2Feb10 from "./past-paper-tests/nust-engineering-net-2-10-feb-2025.json";
import net2Feb14 from "./past-paper-tests/nust-engineering-net-2-14-feb-2025.json";
import net2Feb23 from "./past-paper-tests/nust-engineering-net-2-23-feb-2025.json";
import net3_2025 from "./past-paper-tests/nust-engineering-net-3-2025.json";
import net4Jun24 from "./past-paper-tests/nust-engineering-net-4-24-jun-2025.json";
import net4Jun28 from "./past-paper-tests/nust-engineering-net-4-28-jun-2025.json";
import net4Jun29 from "./past-paper-tests/nust-engineering-net-4-29-jun-2025.json";
import net4_2025 from "./past-paper-tests/nust-engineering-net-4-2025.json";

const sourceNote =
  "Memory-based practice compilation, not an official NUST-released exam. The answer key is reproduced from the supplied PDF and has not been certified by NUST.";

export const pastPaperTests: ExamTest[] = [
  {
    slug: "nust-engineering-net-1-26-nov-2026",
    title: "NUST Engineering NET 1 — 26 Nov 2026",
    questions: net1Nov2026 as ExamQuestion[],
    attemptKey: "meritlab-past-paper-net1-26-nov-2026-attempt",
    basePath: "/past-papers",
    volume: "Volume XIV",
    period: "26 Nov 2026",
    sourceFile: "NUST Engineering NET 1 26-Nov 2026 Most Repeated Questions.pdf",
    sourceNote,
    correctionNotes: [
      "Q7 option A was a duplicate of 2ⁿ in the PDF; it is shown as 2n to make the distractor distinct. The supplied key's answer B is unchanged.",
      "Q48 powers of n are typeset explicitly to distinguish 2ⁿ from 2n. The supplied key's answer is unchanged.",
    ],
  },
  {
    slug: "nust-engineering-net-1-09-dec-2026",
    title: "NUST Engineering NET 1 — 09 Dec 2026",
    questions: net1Dec2026 as ExamQuestion[],
    attemptKey: "meritlab-past-paper-net1-09-dec-2026-attempt",
    basePath: "/past-papers",
    period: "09 Dec 2026",
    sourceFile: "NUST Engineering NET 1 09-Dec 2026 Most Repeated Questions.pdf",
    sourceNote:
      "Memory-based practice compilation, not an official NUST-released exam. The source filename is dated 09 Dec 2026; verify that date before treating it as a completed sitting. Its answer key has not been certified by NUST.",
    correctionNotes: [
      "Q39 answer corrected from A to C: solving aₙ − 2 = 3n − 11 gives aₙ = 3n − 9.",
      "Q50 powers of n are typeset explicitly to distinguish 2ⁿ from 2n; option D is the linear distractor.",
    ],
  },
  {
    slug: "nust-engineering-net-1-2026",
    title: "NUST Engineering NET 1 — 2026",
    questions: net1_2026 as ExamQuestion[],
    attemptKey: "meritlab-past-paper-net1-2026-attempt",
    basePath: "/past-papers",
    volume: "Volume XIII",
    period: "2026",
    sourceFile: "NUST Engineering NET 1-2026 Most Repeated Questions.pdf",
    sourceNote,
  },
  {
    slug: "nust-engineering-net-1-2025",
    title: "NUST Engineering NET 1 — 2025",
    questions: net1_2025 as ExamQuestion[],
    attemptKey: "meritlab-past-paper-net1-2025-attempt",
    basePath: "/past-papers",
    volume: "Volume IV",
    period: "2025",
    sourceFile: "NUST Engineering NET 1-2025 Most Repeated Questions.pdf",
    sourceNote,
  },
  {
    slug: "nust-engineering-net-2-23-feb-2025",
    title: "NUST Engineering NET 2 — 23 Feb 2025",
    questions: net2Feb23 as ExamQuestion[],
    attemptKey: "meritlab-past-paper-net2-23-feb-2025-attempt",
    basePath: "/past-papers",
    volume: "Volume VII",
    period: "23 Feb 2025",
    sourceFile: "NUST Engineering NET 2 23-Feb 2025 Most Repeated Questions.pdf",
    sourceNote,
    correctionNotes: [
      "Q2 and Q46 powers of n are typeset explicitly to distinguish 2ⁿ from 2n. The supplied answer-key positions are unchanged.",
    ],
  },
  {
    slug: "nust-engineering-net-2-14-feb-2025",
    title: "NUST Engineering NET 2 — 14 Feb 2025",
    questions: net2Feb14 as ExamQuestion[],
    attemptKey: "meritlab-past-paper-net2-14-feb-2025-attempt",
    basePath: "/past-papers",
    volume: "Volume III",
    period: "14 Feb 2025",
    sourceFile: "NUST Engineering NET 2 14-Feb 2025 Most Repeated Questions.pdf",
    sourceNote,
    correctionNotes: [
      "Q189 restores the full segmented grammar prompt and answer choices after unrelated PDF text was merged into option D. The supplied key's answer C is unchanged.",
    ],
  },
  {
    slug: "nust-engineering-net-2-10-feb-2025",
    title: "NUST Engineering NET 2 — 10 Feb 2025",
    questions: net2Feb10 as ExamQuestion[],
    attemptKey: "meritlab-past-paper-net2-10-feb-2025-attempt",
    basePath: "/past-papers",
    volume: "Volume VI",
    period: "10 Feb 2025",
    sourceFile: "NUST Engineering NET 2 10-Feb 2025 Most Repeated Questions.pdf",
    sourceNote,
  },
  {
    slug: "nust-engineering-net-2-09-feb-2025",
    title: "NUST Engineering NET 2 — 09 Feb 2025",
    questions: net2Feb09 as ExamQuestion[],
    attemptKey: "meritlab-past-paper-net2-09-feb-2025-attempt",
    basePath: "/past-papers",
    volume: "Volume VIII",
    period: "09 Feb 2025",
    sourceFile: "NUST Engineering NET 2 09-Feb 2025 Most Repeated Questions.pdf",
    sourceNote,
  },
  {
    slug: "nust-engineering-net-3-2025",
    title: "NUST Engineering NET 3 — 2025",
    questions: net3_2025 as ExamQuestion[],
    attemptKey: "meritlab-past-paper-net3-2025-attempt",
    basePath: "/past-papers",
    volume: "Volume IX",
    period: "2025",
    sourceFile: "NUST Engineering NET 3-2025 Most Repeated Questions.pdf",
    sourceNote,
  },
  {
    slug: "nust-engineering-net-4-29-jun-2025",
    title: "NUST Engineering NET 4 — 29 Jun 2025",
    questions: net4Jun29 as ExamQuestion[],
    attemptKey: "meritlab-past-paper-net4-29-jun-2025-attempt",
    basePath: "/past-papers",
    volume: "Volume XI",
    period: "29 Jun 2025",
    sourceFile: "NUST Engineering NET 4 29-Jun 2025 Most Repeated Questions.pdf",
    sourceNote,
    correctionNotes: [
      "Q11 option B duplicated the transposed matrix in the PDF; it is shown as the original matrix to make the distractor distinct. The supplied key's answer A is unchanged.",
    ],
  },
  {
    slug: "nust-engineering-net-4-28-jun-2025",
    title: "NUST Engineering NET 4 — 28 Jun 2025",
    questions: net4Jun28 as ExamQuestion[],
    attemptKey: "meritlab-past-paper-net4-28-jun-2025-attempt",
    basePath: "/past-papers",
    volume: "Volume X",
    period: "28 Jun 2025",
    sourceFile: "NUST Engineering NET 4 28-Jun 2025 Most Repeated Questions.pdf",
    sourceNote,
  },
  {
    slug: "nust-engineering-net-4-24-jun-2025",
    title: "NUST Engineering NET 4 — 24 Jun 2025",
    questions: net4Jun24 as ExamQuestion[],
    attemptKey: "meritlab-past-paper-net4-24-jun-2025-attempt",
    basePath: "/past-papers",
    volume: "Volume XII",
    period: "24 Jun 2025",
    sourceFile: "NUST Engineering NET 4 24-Jun 2025 Most Repeated Questions.pdf",
    sourceNote,
  },
  {
    slug: "nust-engineering-net-4-2025",
    title: "NUST Engineering NET 4 — 2025",
    questions: net4_2025 as ExamQuestion[],
    attemptKey: "meritlab-past-paper-net4-2025-attempt",
    basePath: "/past-papers",
    volume: "Volume V",
    period: "2025",
    sourceFile: "NUST Engineering NET 4-2025 Most Repeated Questions.pdf",
    sourceNote,
    correctionNotes: [
      "Q50 answer clarified as 2^(n − 1), the sum of even-indexed binomial coefficients. The supplied key points to option B; its flattened exponent is corrected.",
      "Q44 flattened combination subscripts are clarified as C(n, n + r) and C(n, n − r); the supplied key's answer B is unchanged.",
    ],
  },
];
