import { memo, FC, useContext } from "react";
import { ROUTE_EXAM, ROUTE_HOMEPAGE } from "../constants.routes";
import { Link, Navigate } from "react-router-dom";
import CountDown from "../Components/CountDown";
import { selectedExamContext } from "../Contexts/selectedExam.context";
import { isExamInstructionTimeStarted, isExamOver, isExamStarted } from "../utils";

interface ExamInstructionsPageProps {}

const ExamInstructionsPage: FC<ExamInstructionsPageProps> = () => {
  const { selectedExam } = useContext(selectedExamContext);

  if (!selectedExam) {
    return <h1>Loading...</h1>;
  }
  const examStartTime = new Date(selectedExam.start_at?.seconds * 1000);

  const handleCase = () => {
    if (isExamInstructionTimeStarted(selectedExam) && !isExamStarted(selectedExam)) {
      return (
        <div>
          <h1>
            <span>Exam will start in </span>
            <CountDown countdownFrom={examStartTime} />
          </h1>
        </div>
      );
    } else if (isExamStarted(selectedExam) && !isExamOver(selectedExam)) {
      return (
        <div>
          <h1>Exam is going on</h1>
          <Link to={ROUTE_EXAM}>Enter</Link>
        </div>
      );
    } else {
      return <Navigate to={ROUTE_HOMEPAGE}></Navigate>;
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-4 mt-2 bg-gray-50 sm:px-6 lg:px-8">
      <div className="flex flex-col text-center items-center flex-wrap w-full mx-auto space-x-2 space-y-2 ">
        <h1>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi tempora mollitia vero perspiciatis sint voluptatum quas in ratione facilis
          cum.
        </h1>
        {handleCase()}
      </div>
    </div>
  );
};

export default memo(ExamInstructionsPage);
