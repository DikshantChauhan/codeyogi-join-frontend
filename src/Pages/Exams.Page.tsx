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
      <h1 className={`text-2xl text-center font-semibold mt-4 mb-2`}>Pick a slot for exam</h1>
      <ExamGrid exams={exams} />
    </>
  );
};

export default memo(Exams);
