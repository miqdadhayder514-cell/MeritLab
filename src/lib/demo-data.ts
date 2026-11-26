export type NetCategory = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  subjects: string[];
  weights: string;
  tint: string;
  icon: string;
};

export const netCategoryOptions = [
  "NET-Engineering",
  "NET-Applied Sciences",
  "NET-Business Studies & Social Sciences",
  "NET-Architecture",
  "NET-Natural Sciences",
];

export const netCategories: NetCategory[] = [
  {
    id: "engineering",
    title: "NET-Engineering",
    eyebrow: "For engineering & computing",
    description:
      "A focused path for Mathematics, Physics, and English with a clear topic-by-topic plan.",
    subjects: ["Mathematics", "Physics", "English"],
    weights: "Math 50% · Physics 30% · English 20%",
    tint: "blue",
    icon: "orbit",
  },
  {
    id: "applied-sciences",
    title: "NET-Applied Sciences",
    eyebrow: "For pre-medical students",
    description:
      "Build confidence across Biology, Chemistry, and English with structured practice.",
    subjects: ["Biology", "Chemistry", "English"],
    weights: "Biology 50% · Chemistry 30% · English 20%",
    tint: "teal",
    icon: "leaf",
  },
  {
    id: "business",
    title: "NET-Business Studies",
    eyebrow: "Business & social sciences",
    description:
      "Sharpen quantitative reasoning and English for business and social science programmes.",
    subjects: ["Quantitative Mathematics", "English"],
    weights: "Quantitative Mathematics 50% · English 50%",
    tint: "amber",
    icon: "briefcase",
  },
  {
    id: "architecture",
    title: "NET-Architecture",
    eyebrow: "Architecture & industrial design",
    description:
      "Explore design aptitude alongside Mathematics and English preparation.",
    subjects: ["Design Aptitude", "Mathematics", "English"],
    weights: "Design Aptitude 50% · Math 30% · English 20%",
    tint: "violet",
    icon: "compass",
  },
  {
    id: "natural-sciences",
    title: "NET-Natural Sciences",
    eyebrow: "For selected science programmes",
    description:
      "Prepare for the Mathematics and English combination where programme eligibility applies.",
    subjects: ["Mathematics", "English"],
    weights: "Mathematics 50% · English 50%",
    tint: "rose",
    icon: "atom",
  },
];

export const subjects = [
  { name: "Mathematics", chapters: 18, progress: 68, color: "blue" },
  { name: "Physics", chapters: 14, progress: 42, color: "violet" },
  { name: "English", chapters: 10, progress: 81, color: "teal" },
  { name: "Chemistry", chapters: 16, progress: 34, color: "amber" },
  { name: "Biology", chapters: 15, progress: 57, color: "rose" },
];

export const recentTests = [
  { name: "Engineering mock · #03", date: "Today, 10:42 AM", score: 76, delta: "+8%" },
  { name: "Physics chapter quiz", date: "Yesterday", score: 84, delta: "+4%" },
  { name: "Mathematics mixed practice", date: "Nov 22", score: 69, delta: "+12%" },
];

export const resources = [
  {
    title: "Conic Sections Cheat Sheet — Crack the Most Difficult Chapter",
    type: "Formula sheet",
    subject: "Mathematics",
    read: "5-page reference",
    icon: "function",
    href: "/resources/formula-sheets/conic-sections",
    downloadHref: "/formula-sheets/conic-sections-cheat-sheet.pdf",
    summary:
      "A clean, highlighted revision guide covering circles, parabolas, ellipses, hyperbolas, tangents, normals, and NET shortcuts.",
  },
  {
    title: "Analytical Geometry",
    type: "Formula sheet",
    subject: "Mathematics",
    read: "5-page reference",
    icon: "function",
    href: "/resources/formula-sheets/analytical-geometry",
    downloadHref: "/formula-sheets/analytical-geometry.pdf",
    summary:
      "Coordinate geometry, section formulae, straight lines, distances, triangle centres, and loci.",
  },
  {
    title: "Differential Equations",
    type: "Formula sheet",
    subject: "Mathematics",
    read: "4-page reference",
    icon: "function",
    href: "/resources/formula-sheets/differential-equations",
    downloadHref: "/formula-sheets/differential-equations.pdf",
    summary:
      "Order and degree, first-order methods, integrating factors, linear ODEs, and applications.",
  },
  {
    title: "Further Differentiation",
    type: "Formula sheet",
    subject: "Mathematics",
    read: "4-page reference",
    icon: "function",
    href: "/resources/formula-sheets/further-differentiation",
    downloadHref: "/formula-sheets/further-differentiation.pdf",
    summary:
      "Derivative rules, implicit and parametric differentiation, tangents, normals, and approximations.",
  },
  {
    title: "Graphical Representation of Functions",
    type: "Formula sheet",
    subject: "Mathematics",
    read: "3-page reference",
    icon: "function",
    href: "/resources/formula-sheets/graphical-representation-of-functions",
    downloadHref: "/formula-sheets/graphical-representation-of-functions.pdf",
    summary:
      "Quadratics, exponential and logarithmic functions, transformations, and growth models.",
  },
  {
    title: "Integration",
    type: "Formula sheet",
    subject: "Mathematics",
    read: "3-page reference",
    icon: "function",
    href: "/resources/formula-sheets/integration",
    downloadHref: "/formula-sheets/integration.pdf",
    summary:
      "Antiderivatives, standard integrals, substitutions, integration by parts, and area.",
  },
  {
    title: "Inverse Trigonometric Functions & Their Graphs",
    type: "Formula sheet",
    subject: "Mathematics",
    read: "3-page reference",
    icon: "function",
    href: "/resources/formula-sheets/inverse-trigonometric-functions",
    downloadHref: "/formula-sheets/inverse-trigonometric-functions.pdf",
    summary:
      "Principal values, domains, ranges, inverse identities, and multiple-angle formulae.",
  },
  {
    title: "Kinematics",
    type: "Formula sheet",
    subject: "Mathematics",
    read: "3-page reference",
    icon: "function",
    href: "/resources/formula-sheets/kinematics",
    downloadHref: "/formula-sheets/kinematics.pdf",
    summary:
      "Straight-line motion, constant acceleration, gravity, calculus, and motion graphs.",
  },
  {
    title: "Solution of Trigonometric Equations",
    type: "Formula sheet",
    subject: "Mathematics",
    read: "3-page reference",
    icon: "function",
    href: "/resources/formula-sheets/solution-of-trigonometric-equations",
    downloadHref: "/formula-sheets/solution-of-trigonometric-equations.pdf",
    summary:
      "Principal and general solutions, auxiliary angles, identities, and applied problems.",
  },
  {
    title: "Vector-Valued Functions & Their Differentiations",
    type: "Formula sheet",
    subject: "Mathematics",
    read: "3-page reference",
    icon: "function",
    href: "/resources/formula-sheets/vector-valued-functions",
    downloadHref: "/formula-sheets/vector-valued-functions.pdf",
    summary:
      "Vector domains, limits, derivative rules, tangent direction, velocity, speed, and acceleration.",
  },
  {
    title: "Waves & oscillations",
    type: "Revision notes",
    subject: "Physics",
    read: "12 min",
    icon: "wave",
  },
  {
    title: "Commonly confused words",
    type: "Study guide",
    subject: "English",
    read: "6 min",
    icon: "book",
  },
  {
    title: "Chemical bonding quick review",
    type: "Important concepts",
    subject: "Chemistry",
    read: "10 min",
    icon: "flask",
  },
  {
    title: "Cell biology concept map",
    type: "Revision notes",
    subject: "Biology",
    read: "9 min",
    icon: "leaf",
  },
];

export const chapters = [
  { name: "Algebra & Functions", topics: 8, done: 6, questions: 124 },
  { name: "Trigonometry", topics: 6, done: 4, questions: 86 },
  { name: "Calculus", topics: 7, done: 2, questions: 112 },
  { name: "Vectors & Mechanics", topics: 5, done: 0, questions: 74 },
  { name: "Analytical Geometry", topics: 6, done: 0, questions: 91 },
];

export const leaderboard = [
  { name: "Areeba Khan", points: 2840, streak: 21, initials: "AK", rank: 1 },
  { name: "Hamza Ahmed", points: 2715, streak: 18, initials: "HA", rank: 2 },
  { name: "Zara Hussain", points: 2630, streak: 16, initials: "ZH", rank: 3 },
  { name: "You", points: 2480, streak: 12, initials: "MK", rank: 4 },
  { name: "Usman Ali", points: 2310, streak: 10, initials: "UA", rank: 5 },
];
