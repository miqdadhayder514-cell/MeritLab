export type ExamQuestion = {
  number: number;
  subject: string;
  difficulty: string;
  sourceNumber?: string;
  context?: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type ExamTest = {
  slug: string;
  title: string;
  questions: ExamQuestion[];
  attemptKey: string;
  basePath?: "/mock-tests" | "/past-papers";
  volume?: string;
  period?: string;
  sourceFile?: string;
  sourceNote?: string;
  correctionNotes?: string[];
};
