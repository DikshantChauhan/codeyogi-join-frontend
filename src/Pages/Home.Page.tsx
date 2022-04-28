import { subMinutes } from "date-fns";
import { memo, FC, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import CountDown from "../Components/CountDown";
import { ROUTE_EXAM_INSTRUCTIONS, ROUTE_SLOTS } from "../constants.routes";
import { selectedExamContext } from "../Contexts/selectedExam.context";
import { userContext } from "../Contexts/user.contextt";

interface HomePageProps {}

const HomePage: FC<HomePageProps> = ({}) => {
  const { selectedExam } = useContext(selectedExamContext);
  const { user } = useContext(userContext);

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

  //Selected exam id
  else if (user?.selected_exam_id) {
    if (user.exam_started_at) {
        //remove this in main exam screen:
    //   const resultTime = selectedExam?.start_at && addMinutes(new Date(selectedExam.start_at.seconds * 1000), 70);
    //   return (
    //     <NoticeText>
    //       <h1>Exam is going on. Your results will be published by ${resultTime?.toLocaleTimeString()}. </h1>
    //     </NoticeText>
    //   );
    }

    const examStartedAt = selectedExam?.start_at.seconds ? new Date(selectedExam?.start_at?.seconds * 1000) : undefined;
    if (!examStartedAt) {
      return <></>;
    }

    const countDownFrom = subMinutes(examStartedAt, 10);
    if (countDownFrom <= new Date()) {
      return <Navigate to={ROUTE_EXAM_INSTRUCTIONS} />;
    }
    return (
      <div>
        <h1>
          <span>Exam will start in</span>
          <CountDown countdownFrom={countDownFrom}></CountDown>
        </h1>
      </div>
    );
  }

  return <></>;
};

export default memo(HomePage);
