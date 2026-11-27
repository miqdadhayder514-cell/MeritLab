import "server-only";

import type { ExamTest } from "./exam-types";
import netEngineeringMockTest1 from "./net-engineering-full-mock-1.json";
import netEngineeringMockTest2 from "./net-engineering-full-mock-2.json";
import netEngineeringMockTest3 from "./net-engineering-full-mock-3.json";
import netEngineeringMockTest4 from "./net-engineering-full-mock-4.json";
import netEngineeringMockTest5 from "./net-engineering-full-mock-5.json";
import netEngineeringMockTest6 from "./net-engineering-full-mock-6.json";
import netEngineeringMockTest7 from "./net-engineering-full-mock-7.json";
import netEngineeringMockTest8 from "./net-engineering-full-mock-8.json";
import netEngineeringMockTest9 from "./net-engineering-full-mock-9.json";
import netEngineeringMockTest10 from "./net-engineering-full-mock-10.json";
import netEngineeringMockTest11 from "./net-engineering-full-mock-11.json";
import netEngineeringMockTest12 from "./net-engineering-full-mock-12.json";
import netEngineeringMockTest13 from "./net-engineering-full-mock-13.json";
import netEngineeringMockTest14 from "./net-engineering-full-mock-14.json";
import netEngineeringMockTest15 from "./net-engineering-full-mock-15.json";
import netEngineeringMockTest16 from "./net-engineering-full-mock-16.json";
import netEngineeringMockTest17 from "./net-engineering-full-mock-17.json";
import netEngineeringMockTest18 from "./net-engineering-full-mock-18.json";
import netEngineeringMockTest19 from "./net-engineering-full-mock-19.json";
import netEngineeringMockTest20 from "./net-engineering-full-mock-20.json";
import { pastPaperTests } from "./past-paper-data";

const mockQuestions = [
  netEngineeringMockTest1,
  netEngineeringMockTest2,
  netEngineeringMockTest3,
  netEngineeringMockTest4,
  netEngineeringMockTest5,
  netEngineeringMockTest6,
  netEngineeringMockTest7,
  netEngineeringMockTest8,
  netEngineeringMockTest9,
  netEngineeringMockTest10,
  netEngineeringMockTest11,
  netEngineeringMockTest12,
  netEngineeringMockTest13,
  netEngineeringMockTest14,
  netEngineeringMockTest15,
  netEngineeringMockTest16,
  netEngineeringMockTest17,
  netEngineeringMockTest18,
  netEngineeringMockTest19,
  netEngineeringMockTest20,
];

export const mockTests: ExamTest[] = mockQuestions.map((questions, index) => {
  const number = index + 1;
  return {
    slug: number === 1 ? "net-engineering" : `net-engineering-${number}`,
    title: `NUST NET-Engineering Full Mock Test ${number}`,
    questions,
    attemptKey: `meritlab-net-engineering-full-mock-${number}-attempt`,
  };
});

export { pastPaperTests };

export type ExamListing = {
  slug: string;
  title: string;
  questionCount: number;
  volume?: string;
  period?: string;
};

function toListing(test: ExamTest): ExamListing {
  return {
    slug: test.slug,
    title: test.title,
    questionCount: test.questions.length,
    volume: test.volume,
    period: test.period,
  };
}

export const mockTestListings = mockTests.map(toListing);
export const pastPaperListings = pastPaperTests.map(toListing);
