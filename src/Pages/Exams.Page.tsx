import { memo, FC, useState, useEffect } from "react";
import { fetchExamListAPI } from "../APIs/exam.api";
import ExamGrid from "../Components/AdmissionTest/ExamGrid";
import NoticeText from "../Components/NoticeText";
import { Exam } from "../Models/Exam";

interface ExamsProps {}

const Exams: FC<ExamsProps> = ({}) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExamListAPI().then((exams) => {
      {
        exams && setExams(exams);
        setIsLoading(false);
      }
    });
  }, []);

  if (!isLoading && (!exams || exams.length === 0)) {
    return (
      <NoticeText>
        <h1 className="px-2 mt-20 text-2xl font-bold text-center">
          Thanks for showing intrest in Codeyogi 😊. Right now there are no exam slots available, visit after some time.
        </h1>
      </NoticeText>
    );
  }

  return (
    <>
      <h1 className={`text-2xl text-center font-semibold mt-4 mb-2`}>Pick a slot for exam</h1>
      <ExamGrid exams={exams} />
    </>
  );
};

export default memo(Exams);
