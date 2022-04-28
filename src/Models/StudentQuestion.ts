export type StudentAnswerOptions = "A" | "B" | "C" | "D" | null | "pass";

export interface StudentQuestion {
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  questionText: string;
  answer: StudentAnswerOptions;
}
