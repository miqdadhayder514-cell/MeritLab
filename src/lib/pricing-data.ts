export type PricingPlan = {
  id: "free" | "plus" | "premium";
  name: string;
  price: number;
  description: string;
  cta: string;
  recommended?: boolean;
  features: string[];
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "MeritLab Free",
    price: 0,
    description: "Start your NUST preparation journey for free.",
    cta: "Get Started Free",
    features: [
      "Access to basic preparation material",
      "Limited daily MCQ practice",
      "Selected topic-wise questions",
      "Basic performance tracking",
      "Limited mock tests",
      "Basic formula sheets",
      "Student dashboard",
      "Bookmark questions",
    ],
  },
  {
    id: "plus",
    name: "MeritLab Plus",
    price: 3000,
    description: "Take your preparation to the next level.",
    cta: "Get MeritLab Plus",
    recommended: true,
    features: [
      "Everything in Free",
      "Expanded MCQ question bank",
      "Higher-limit practice sessions",
      "Full chapter-wise practice",
      "Detailed answer explanations",
      "More mock examinations",
      "Advanced performance analytics",
      "Complete formula sheets",
      "Weak-topic identification",
      "Complete practice history",
      "Advanced revision tools",
    ],
  },
  {
    id: "premium",
    name: "MeritLab Premium",
    price: 6000,
    description: "Your complete preparation experience for NUST.",
    cta: "Get MeritLab Premium",
    features: [
      "Everything in Plus",
      "Full access to available mock examinations",
      "Advanced performance insights",
      "Personalized preparation recommendations",
      "Full access to available revision resources",
      "Advanced question review",
      "Priority support (availability to be confirmed)",
      "Additional premium preparation features",
    ],
  },
];

export const pricingComparison = [
  {
    feature: "MCQ practice",
    values: [
      "Selected practice (planned)",
      "Expanded question bank (planned)",
      "Full available bank (planned)",
    ],
  },
  {
    feature: "Daily practice limits",
    values: [
      "Limited · exact limit pending",
      "Higher limit · pending",
      "Premium access · pending",
    ],
  },
  {
    feature: "Chapter-wise preparation",
    values: [
      "Basic access · planned",
      "Full chapters · planned",
      "Full chapters · planned",
    ],
  },
  {
    feature: "Question explanations",
    values: ["Basic · planned", "Detailed · planned", "Advanced review · planned"],
  },
  {
    feature: "Mock tests",
    values: [
      "Limited · planned",
      "Expanded access · planned",
      "All available · planned",
    ],
  },
  {
    feature: "Formula sheets",
    values: ["Basic · planned", "Complete · planned", "Complete · planned"],
  },
  {
    feature: "Revision resources",
    values: ["Selected · planned", "Expanded · planned", "All available · planned"],
  },
  {
    feature: "Performance analytics",
    values: ["Basic · planned", "Advanced · planned", "Advanced insights · planned"],
  },
  {
    feature: "Weak-topic analysis",
    values: ["—", "Included · planned", "Included · planned"],
  },
  {
    feature: "Bookmarks",
    values: ["Included · planned", "Included · planned", "Included · planned"],
  },
  {
    feature: "Practice history",
    values: ["Basic · planned", "Complete · planned", "Complete · planned"],
  },
  {
    feature: "Personalized recommendations",
    values: ["—", "—", "Planned"],
  },
  {
    feature: "Support",
    values: ["Standard · pending", "Standard · pending", "Priority · pending"],
  },
];
