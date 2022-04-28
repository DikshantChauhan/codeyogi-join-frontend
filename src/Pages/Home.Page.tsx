import { subMinutes } from "date-fns";
import { memo, FC, useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchSelectedExam } from "../APIs/exam.api";
import CountDown from "../Components/CountDown";
import NoticeText from "../Components/NoticeText";
import { ROUTE_EXAM_INSTRUCTIONS, ROUTE_SLOTS } from "../constants.routes";
import { userContext } from "../Contexts/user.contextt";
import { Exam } from "../Models/Exam";
import { secondsToHHMMSS } from "../utils";

interface HomePageProps {}

const HomePage: FC<HomePageProps> = ({}) => {
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
    const [selectedExam, setSelectedExam] = useState<Exam>();
    const [isExamFetching, setIsExamFetching] = useState(true);

    useEffect(() => {
      if (user) {
        fetchSelectedExam()
          .then((selectedExam) => {
            selectedExam && setSelectedExam(selectedExam);
            setIsExamFetching(false);
          })
          .catch(() => {
            setIsExamFetching(false);
          });
      }
    }, [user]);

    if (!selectedExam && !isExamFetching) {
      return <NoticeText>Anable to fetch Exam! please try again after sometime.</NoticeText>;
    }

    if (user.exam_started_at) {
      return (
        <NoticeText>
          <h1>Exam is going on. Your results will be published when exam is over.</h1>
        </NoticeText>
      );
    }

    const examStartedAt = selectedExam?.start_at.seconds ? new Date(selectedExam?.start_at?.seconds * 1000) : undefined;
    if (!examStartedAt) {
      return <></>;
    }

    const countDownFrom = subMinutes(examStartedAt, 10);
    if (countDownFrom <= new Date()) {
      return (
        <NoticeText>
          <div>
            <h1>Exam Started.</h1>
            <Link to={ROUTE_EXAM_INSTRUCTIONS}>Enter exam</Link>
          </div>
        </NoticeText>
      );
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
