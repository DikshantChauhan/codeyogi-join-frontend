import { memo, FC, useState, useEffect } from "react";
import { fetchExamList } from "../APIs/exam.api";
import ExamGrid from "../Components/AdmissionTest/ExamGrid";
import { Exam } from "../Models/Exam";

interface ExamsProps {}

const Exams: FC<ExamsProps> = ({}) => {
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    fetchExamList().then((exams) => {
      {
        exams && setExams(exams);
      }
    });
  }, []);

  return (
    <>
      <h1 className={`text-xl font-bold`}>Test for CodeYogi</h1>

      <ExamGrid exams={exams} />
    </>
  );
};

export default memo(Exams);
