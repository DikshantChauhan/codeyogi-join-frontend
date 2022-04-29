import { memo, FC, useContext } from "react";
import { Link } from "react-router-dom";
import {  ROUTE_SLOTS } from "../constants.routes";
import { isQuestionFetchableContext } from "../Contexts/isQuestionFetchable";
import { selectedExamContext } from "../Contexts/selectedExam.context";
import { userContext } from "../Contexts/user.contextt";
import { useCountdown } from "../Hooks/Countdown";
import { getExamInstructionTimeStartedAt, getResultTime, hasExamInstructionTimeStarted, isExamOver } from "../utils";

interface HomePageProps {}

const HomePage: FC<HomePageProps> = ({}) => {
  const { selectedExam } = useContext(selectedExamContext);
  const { user } = useContext(userContext);
  const resultTime = selectedExam && getResultTime(selectedExam)?.toLocaleTimeString();
  const {isQuestionFetchable} = useContext(isQuestionFetchableContext)

  //Skipped
  if (user?.status === "skipped") {
    return (
      <div>
        <h1>You missed the exam😔.</h1>
        <Link to={ROUTE_SLOTS}>Go here to pick a slot.</Link>
      </div>
    );
  }

  //Passed
  else if (user?.status === "passed") {
    return (
      <div>
        <h1>🎊 Congratultions! 🎊</h1>
        <h1>You passed.</h1>
      </div>
    );
  }

  //Failed
  else if (user?.status === "failed") {
    return (
      <div>
        <h1>Sorry 😔</h1>
        <h1>You failed.</h1>
      </div>
    );
  }

  //CountDown
  else if (selectedExam && !hasExamInstructionTimeStarted(selectedExam)) {
    const countDownFrom = getExamInstructionTimeStartedAt(selectedExam);
    const timer = useCountdown(countDownFrom);
    return (
      <div>
        <h1>
          <span>Exam will start in</span>
          <span>{timer}</span>
        </h1>
      </div>
    );
  }

  //Exam over
  else if (selectedExam && isExamOver(selectedExam)) {
    return <h1>Your results will be published by {resultTime}</h1>;
  }

  //Student finished early
  else if (!isQuestionFetchable) {
    return (
      <div>
        <h1>Exam is going on..Your results will be published by {resultTime}</h1>
      </div>
    );
  }

  //exam over, result not posted, exam_start_at = null
  
  return <></>;
};

export default memo(HomePage);
