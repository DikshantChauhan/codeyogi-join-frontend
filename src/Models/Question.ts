export type option = "A" | "B" | "C" | "D";
export type answer = option | "pass";

export interface Question {
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  questionText: string;
  answer: null | answer;
}
