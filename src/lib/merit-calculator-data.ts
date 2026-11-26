export type MeritCategory =
  | "Engineering & technology"
  | "General universities"
  | "Medical & health sciences";

export type MeritProgram = {
  id: string;
  name: string;
  formulaId?: string;
};

export type MeritUniversity = {
  id: string;
  name: string;
  category: MeritCategory;
  programs: MeritProgram[];
  campuses?: string[];
  campusesSourceUrl?: string;
};

const programs = {
  engineering: [
    { id: "engineering", name: "Engineering programs" },
    { id: "computing", name: "Computing & IT programs" },
    { id: "architecture", name: "Architecture & design programs" },
    { id: "business", name: "Business & management programs" },
  ],
  technology: [
    { id: "engineering", name: "Engineering & technology programs" },
    { id: "computing", name: "Computing & IT programs" },
    { id: "business", name: "Business & management programs" },
  ],
  general: [
    { id: "sciences", name: "Science programs" },
    { id: "computing", name: "Computing & IT programs" },
    { id: "business", name: "Business & management programs" },
    { id: "social-sciences", name: "Social sciences & humanities programs" },
  ],
  medical: [
    { id: "mbbs", name: "MBBS" },
    { id: "bds", name: "BDS" },
  ],
} satisfies Record<string, MeritProgram[]>;

export const meritCategories: MeritCategory[] = [
  "Engineering & technology",
  "General universities",
  "Medical & health sciences",
];

export const meritUniversities: MeritUniversity[] = [
  {
    id: "nust",
    name: "NUST",
    category: "Engineering & technology",
    programs: [
      ...programs.engineering,
      { id: "sciences", name: "Natural sciences programs" },
    ],
  },
  {
    id: "fast-nuces",
    name: "FAST-NUCES",
    category: "Engineering & technology",
    programs: [
      { id: "computing-fast", name: "Computing programs · FAST admission test" },
      { id: "computing-nat", name: "Computing programs · NTS NAT" },
      { id: "computing-sat", name: "Computing programs · SAT" },
      { id: "engineering", name: "Engineering programs" },
      { id: "business", name: "Business programs" },
    ],
  },
  {
    id: "comsats",
    name: "COMSATS University",
    category: "Engineering & technology",
    campuses: [
      "Islamabad",
      "Lahore",
      "Abbottabad",
      "Wah Cantt",
      "Attock",
      "Sahiwal",
      "Vehari",
      "Virtual Campus",
    ],
    campusesSourceUrl: "https://comsats.edu.pk/",
    programs: [
      { id: "engineering", name: "Engineering programs" },
      { id: "computing", name: "Computing programs" },
      { id: "sciences", name: "Science programs" },
      { id: "business", name: "Business programs" },
    ],
  },
  {
    id: "uet-lahore",
    name: "UET Lahore",
    category: "Engineering & technology",
    programs: [
      { id: "engineering", name: "Engineering programs" },
      { id: "computing", name: "Computing & technology programs" },
      { id: "architecture", name: "Architecture & design programs" },
    ],
  },
  {
    id: "uet-taxila",
    name: "UET Taxila",
    category: "Engineering & technology",
    programs: [
      { id: "engineering", name: "Engineering programs" },
      { id: "computing", name: "Computing & IT programs" },
    ],
  },
  {
    id: "uet-peshawar",
    name: "UET Peshawar",
    category: "Engineering & technology",
    programs: [
      { id: "engineering", name: "Engineering programs" },
      { id: "computing", name: "Computing & IT programs" },
      { id: "architecture", name: "Architecture programs" },
    ],
  },
  {
    id: "ned",
    name: "NED University",
    category: "Engineering & technology",
    campuses: ["THAR (TIEST) CAMPUS"],
    campusesSourceUrl: "https://www.neduet.edu.pk/admission",
    programs: [
      { id: "engineering", name: "Engineering programs" },
      { id: "computing", name: "Computing & IT programs" },
      { id: "architecture", name: "Architecture programs" },
    ],
  },
  {
    id: "giki",
    name: "GIKI",
    category: "Engineering & technology",
    programs: [
      { id: "engineering", name: "Engineering programs" },
      { id: "computing", name: "Computing programs" },
      { id: "management-sciences", name: "Management sciences programs" },
    ],
  },
  {
    id: "pieas",
    name: "PIEAS",
    category: "Engineering & technology",
    programs: [
      { id: "engineering", name: "Engineering programs" },
      { id: "computing", name: "Computing programs" },
      { id: "sciences", name: "Science programs" },
    ],
  },
  {
    id: "air-university",
    name: "Air University",
    category: "Engineering & technology",
    programs: [...programs.technology, { id: "sciences", name: "Science programs" }],
  },
  {
    id: "itu-lahore",
    name: "ITU Lahore",
    category: "Engineering & technology",
    programs: [
      { id: "computing", name: "Computing & IT programs" },
      { id: "engineering", name: "Engineering programs" },
      { id: "business", name: "Business programs" },
    ],
  },
  {
    id: "nutech",
    name: "NUTECH",
    category: "Engineering & technology",
    programs: [
      ...programs.technology,
      { id: "architecture", name: "Architecture programs" },
    ],
  },
  {
    id: "bahria",
    name: "Bahria University",
    category: "Engineering & technology",
    campuses: [
      "E-8, Islamabad",
      "H-11, Islamabad",
      "Karachi",
      "Lahore",
      "Health Sciences, Islamabad",
      "Health Sciences, Karachi",
    ],
    campusesSourceUrl: "https://www.bahria.edu.pk/",
    programs: [
      ...programs.technology,
      { id: "sciences", name: "Science & health programs" },
    ],
  },
  {
    id: "punjab-university",
    name: "University of the Punjab",
    category: "General universities",
    programs: [
      ...programs.general,
      { id: "engineering", name: "Engineering programs" },
    ],
  },
  {
    id: "qau",
    name: "Quaid-i-Azam University",
    category: "General universities",
    programs: [
      ...[
        "Computer Science",
        "Chemistry",
        "Electronics",
        "Geophysics",
        "Information Technology",
        "Mathematics",
        "Physics",
        "Statistics",
        "Biochemistry",
        "Biotechnology",
        "Bioinformatics",
        "Botany",
        "Environmental Sciences",
        "Microbiology",
        "Zoology",
        "Anthropology",
        "Tourism & Hospitality",
        "Archaeology",
        "Business Administration",
        "Defence & Strategic Studies",
        "Economics",
        "English",
        "History",
        "International Relations",
        "Political Science",
        "Public Administration",
        "Pakistan Studies",
        "Psychology",
        "Sociology",
        "Social Work",
        "Gender Studies",
        "Governance & Policy Studies",
      ].map((name) => ({
        id: `bs-${name
          .toLowerCase()
          .replaceAll("&", "")
          .replaceAll(/[^a-z0-9]+/g, "-")
          .replaceAll(/^-|-$/g, "")}`,
        name: `BS ${name} · Fall 2026 morning`,
        formulaId: "bs",
      })),
      { id: "pharm-d", name: "Pharm-D · Fall 2026 morning" },
      { id: "llb", name: "LLB · Fall 2026 morning" },
    ],
  },
  {
    id: "gcu-lahore",
    name: "Government College University Lahore",
    category: "General universities",
    programs: [
      {
        id: "open-merit",
        name: "Regular undergraduate open merit · standard programs",
      },
      {
        id: "engineering-technology",
        name: "Electrical Engineering / Information Security Engineering Technology",
      },
    ],
  },
  {
    id: "karachi-university",
    name: "University of Karachi",
    category: "General universities",
    programs: [
      ...programs.general,
      { id: "engineering", name: "Engineering programs" },
    ],
  },
  {
    id: "uaf",
    name: "University of Agriculture Faisalabad",
    category: "General universities",
    campuses: [
      "Main Campus, Faisalabad",
      "Toba Tek Singh",
      "Burewala / Vehari",
      "Depalpur, Okara",
    ],
    campusesSourceUrl: "https://web.uaf.edu.pk/",
    programs: [
      { id: "agriculture", name: "Agriculture & allied programs" },
      { id: "sciences", name: "Science programs" },
      { id: "computing", name: "Computing programs" },
      { id: "business", name: "Business programs" },
    ],
  },
  {
    id: "iiui",
    name: "International Islamic University Islamabad",
    category: "General universities",
    programs: [
      ...programs.general,
      { id: "engineering", name: "Engineering programs" },
    ],
  },
  {
    id: "pmdc-mbbs-bds",
    name: "PM&DC national policy (MBBS / BDS)",
    category: "Medical & health sciences",
    programs: [...programs.medical],
  },
  {
    id: "uhs-punjab",
    name: "UHS / Punjab public medical admissions",
    category: "Medical & health sciences",
    programs: [...programs.medical],
  },
  {
    id: "nums",
    name: "NUMS",
    category: "Medical & health sciences",
    programs: [...programs.medical],
  },
  {
    id: "kmu",
    name: "KMU",
    category: "Medical & health sciences",
    programs: [...programs.medical],
  },
];
