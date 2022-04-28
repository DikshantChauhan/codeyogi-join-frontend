import { memo, FC, useState, useEffect } from "react";
import { Exam } from "../Models/Exam";
import { addMinutes } from "date-fns";
import { fetchSelectedExam } from "../APIs/exam.api";
import { ROUTE_EXAM } from "../constants.routes";
import { Link } from "react-router-dom";
import CountDown from "../Components/CountDown";

interface ExamInstructionsPageProps {}

const ExamInstructionsPage: FC<ExamInstructionsPageProps> = () => {
  const [exam, setExam] = useState<Exam>();
  useEffect(() => {
    fetchSelectedExam().then((response) => {
      setExam(response);
    });
  }, []);

  if (!exam) {
    return <h1>Loading...</h1>;
  }
  const examStartTime = new Date(exam.start_at?.seconds);
  const examEntryTimeLimit = addMinutes(examStartTime, 10);

  return (
    <div className="flex items-center justify-center px-4 py-4 mt-2 bg-gray-50 sm:px-6 lg:px-8">
      <div className="flex flex-wrap w-full mx-auto space-x-2 space-y-2 ">
        <CountDown countdownFrom={examEntryTimeLimit} />
        <Link to={ROUTE_EXAM}>Ready</Link>
      </div>
    </div>
  );
};

export default memo(ExamInstructionsPage);
