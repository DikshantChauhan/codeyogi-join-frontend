import { format } from "date-fns/esm";
import { memo, FC, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import NoticeText from "../Components/NoticeText";
import { ROUTE_EXAM_INSTRUCTIONS, ROUTE_HOMEPAGE, ROUTE_SLOTS } from "../constants.routes";
import { allowedRoutesContext } from "../Contexts/allowedRoutes.context";
import { isQuestionFetchableContext } from "../Contexts/isQuestionFetchable";
import { selectedExamContext } from "../Contexts/selectedExam.context";
import { userContext } from "../Contexts/user.contextt";
import { useCountdown } from "../Hooks/Countdown";
import { getExamInstructionTimeStartedAt, getResultTime, hasExamInstructionTimeStarted, isExamOver } from "../utils";

interface HomePageProps {}

const HomePage: FC<HomePageProps> = ({}) => {
  const { selectedExam } = useContext(selectedExamContext);
  const { user } = useContext(userContext);
  const resultDate = getResultTime(selectedExam!);
  const resultTime = format(resultDate, "hh:mm:ss b");
  const { isQuestionFetchable } = useContext(isQuestionFetchableContext);
  const countDownFrom = getExamInstructionTimeStartedAt(selectedExam!);
  const navigate = useNavigate();
  const { allowedRoutes, setAllowedRoutes } = useContext(allowedRoutesContext);
  const handleCountDownFinished = useCallback(() => {
    const currentAllowedRoutes = [...allowedRoutes].filter((route) => route !== ROUTE_HOMEPAGE);
    currentAllowedRoutes.unshift(ROUTE_EXAM_INSTRUCTIONS);
    setAllowedRoutes(currentAllowedRoutes);
    navigate(ROUTE_EXAM_INSTRUCTIONS);
  }, []);

  //Skipped
  if (user?.status === "skipped") {
    return (
      <NoticeText>
        <h1>You missed the exam 😔.</h1>

        <h1>You can check for available exam slots by following the link below</h1>

        <div className={`mt-5`}>
          <Link className={`underline text-indigo-500 `} to={ROUTE_SLOTS}>
            Schedule Exam
          </Link>
        </div>
      </NoticeText>
    );
  }

  //Passed
  else if (user?.status === "passed") {
    return (
      <NoticeText>
        <h1>🎊 Congratultions! 🎊</h1>
        <h1>You Passed</h1>
        <h1>You passed, we will contact you for the next steps.</h1>
      </NoticeText>
    );
  }

  //Failed
  else if (user?.status === "failed") {
    return (
      <NoticeText>
        <h1>Sorry 😔</h1>
        <h1>You failed.</h1>
      </NoticeText>
    );
  }

  //CountDown
  else if (!hasExamInstructionTimeStarted(selectedExam!)) {
    const timer = useCountdown(countDownFrom, { onCountDownFinish: handleCountDownFinished });
    return (
      <NoticeText>
        <h1>Exam will start in</h1>

        <h1>{timer}</h1>
      </NoticeText>
    );
  }

  //exam over, result not posted, exam_start_at = null
  else if (isExamOver(selectedExam!) && !user?.exam_started_at) {
    return (
      <NoticeText>
        <h1>You didn't enter in exam, you will be able to re-pick slots once result for this exam is published</h1>
      </NoticeText>
    );
  }

  //Exam over
  else if (isExamOver(selectedExam!)) {
    return (
      <NoticeText>
        <h1>Your results will be published by {resultTime}</h1>
      </NoticeText>
    );
  }

  //Student finished early
  else if (!isQuestionFetchable) {
    return (
      <NoticeText>
        <h1>Exam is going on..Your results will be published by {resultTime}</h1>
      </NoticeText>
    );
  }

  return <></>;
};

export default memo(HomePage);
