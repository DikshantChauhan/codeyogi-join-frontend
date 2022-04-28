import { createContext } from "react";
import { Exam } from "../Models/Exam";

export const defaultSelectedExamContext: {
  selectedExam: Exam | null;
  setSelectedExam: (exam: Exam) => void;
} = {
  selectedExam: null,
  setSelectedExam: (exam: Exam) => {
    defaultSelectedExamContext.selectedExam = exam;
  },
};

export const selectedExamContext = createContext(defaultSelectedExamContext);
