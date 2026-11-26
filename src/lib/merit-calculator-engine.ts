export type MeritScoreField =
  | "matric"
  | "hssc-part1"
  | "hssc-part2"
  | "hssc-complete"
  | "net"
  | "fast-test"
  | "nat"
  | "ecat"
  | "giki-test"
  | "pieas-test"
  | "ned-test"
  | "mdcat"
  | "nums-mdcat"
  | "lat"
  | "etea"
  | "other-test";

export type MeritScore = {
  obtained: string;
  total: string;
};

export type MeritScoreInputs = Partial<Record<MeritScoreField, MeritScore>>;

export type MeritFormulaComponent = {
  field: MeritScoreField;
  alternativeFields?: MeritScoreField[];
  label: string;
  weight: number;
};

export type VerifiedMeritFormula = {
  id: string;
  universityId: string;
  programId: string;
  admissionCycle: string;
  components: MeritFormulaComponent[];
  officialRule: string;
  eligibilityNotes: string[];
  sourceUrl: string;
  sourceTitle: string;
  additionalSources?: { url: string; title: string }[];
  lastVerified: string;
  verificationStatus: "verified";
};

export type ComponentContribution = MeritFormulaComponent & {
  inputField: MeritScoreField;
  percentage: number;
  contribution: number;
};

export type MeritCalculation =
  | {
      ok: true;
      aggregate: number;
      contributions: ComponentContribution[];
    }
  | { ok: false; errors: string[] };

export function scorePercentage(score: MeritScore | undefined): number | null {
  if (!score || score.obtained.trim() === "" || score.total.trim() === "") return null;

  const obtained = Number(score.obtained);
  const total = Number(score.total);
  if (
    !Number.isFinite(obtained) ||
    !Number.isFinite(total) ||
    obtained < 0 ||
    total <= 0 ||
    obtained > total
  ) {
    return null;
  }
  return (obtained / total) * 100;
}

export function validateMeritScores(
  inputs: MeritScoreInputs,
  requiredFields: MeritScoreField[],
  requiredFieldGroups: MeritScoreField[][] = [],
): string[] {
  const errors: string[] = [];

  for (const [field, score] of Object.entries(inputs) as [
    MeritScoreField,
    MeritScore,
  ][]) {
    const obtainedText = score.obtained.trim();
    const totalText = score.total.trim();
    if (!obtainedText && !totalText) continue;

    const label = scoreFieldLabels[field];
    if (!obtainedText || !totalText) {
      errors.push(`${label}: enter both obtained and total marks.`);
      continue;
    }

    const obtained = Number(obtainedText);
    const total = Number(totalText);
    if (!Number.isFinite(obtained) || !Number.isFinite(total)) {
      errors.push(`${label}: enter valid numbers.`);
    } else if (obtained < 0 || total <= 0) {
      errors.push(
        `${label}: marks cannot be negative and total must be greater than zero.`,
      );
    } else if (obtained > total) {
      errors.push(`${label}: obtained marks cannot exceed total marks.`);
    }
  }

  for (const field of requiredFields) {
    const score = inputs[field];
    if (!score?.obtained.trim() || !score.total.trim()) {
      const label = scoreFieldLabels[field];
      if (!errors.some((error) => error.startsWith(`${label}:`))) {
        errors.push(`${label}: this score is required for the selected formula.`);
      }
    }
  }
  for (const fields of requiredFieldGroups) {
    if (fields.some((field) => scorePercentage(inputs[field]) !== null)) continue;
    errors.push(
      `${fields.map((field) => scoreFieldLabels[field]).join(" or ")}: enter one of these scores for the selected formula.`,
    );
  }
  return errors;
}

export function calculateMeritAggregate(
  formula: VerifiedMeritFormula,
  inputs: MeritScoreInputs,
): MeritCalculation {
  const errors = validateMeritScores(
    inputs,
    formula.components
      .filter((component) => !component.alternativeFields?.length)
      .map((component) => component.field),
    formula.components
      .filter((component) => component.alternativeFields?.length)
      .map((component) => [component.field, ...(component.alternativeFields ?? [])]),
  );
  if (errors.length > 0) return { ok: false, errors };

  const weightTotal = formula.components.reduce(
    (total, component) => total + component.weight,
    0,
  );
  if (Math.abs(weightTotal - 100) > 0.0001) {
    return {
      ok: false,
      errors: [
        `Formula configuration error: component weights total ${weightTotal}%, not 100%.`,
      ],
    };
  }

  const contributions: ComponentContribution[] = [];
  for (const component of formula.components) {
    const componentInputs = [component.field, ...(component.alternativeFields ?? [])];
    const inputField = componentInputs.find(
      (field) => scorePercentage(inputs[field]) !== null,
    );
    const percentage = inputField ? scorePercentage(inputs[inputField]) : null;
    if (percentage === null) {
      return {
        ok: false,
        errors: [
          `${component.label}: score could not be calculated from the entered marks.`,
        ],
      };
    }
    contributions.push({
      ...component,
      inputField: inputField ?? component.field,
      percentage,
      contribution: (percentage * component.weight) / 100,
    });
  }

  return {
    ok: true,
    aggregate: contributions.reduce(
      (total, contribution) => total + contribution.contribution,
      0,
    ),
    contributions,
  };
}

export const scoreFieldLabels: Record<MeritScoreField, string> = {
  matric: "Matric / SSC",
  "hssc-part1": "FSc / HSSC Part-I",
  "hssc-part2": "FSc / HSSC Part-II",
  "hssc-complete": "Complete FSc / HSSC",
  net: "NUST NET",
  "fast-test": "FAST admission test",
  nat: "NTS NAT",
  ecat: "ECAT",
  "giki-test": "GIKI admission test",
  "pieas-test": "PIEAS admission test",
  "ned-test": "NED entry test",
  mdcat: "MDCAT",
  "nums-mdcat": "NUMS MDCAT",
  lat: "HEC Law Admission Test (LAT)",
  etea: "ETEA",
  "other-test": "Other relevant test",
};

export const scoreFieldGroups: {
  title: string;
  fields: MeritScoreField[];
}[] = [
  {
    title: "School & college marks",
    fields: ["matric", "hssc-part1", "hssc-part2", "hssc-complete"],
  },
  {
    title: "Entry-test scores",
    fields: [
      "net",
      "fast-test",
      "nat",
      "ecat",
      "giki-test",
      "pieas-test",
      "ned-test",
      "mdcat",
      "nums-mdcat",
      "lat",
      "etea",
      "other-test",
    ],
  },
];
