import { FC, memo, useContext, useEffect, useState } from "react";
import { fetchSelectedExamAPI } from "../APIs/exam.api";
import { userContext } from "../Contexts/user.contextt";
import { Exam } from "../Models/Exam";
import { secondsToHHMMSS } from "../utils";

interface CountdownProps {}

const Countdown: FC<CountdownProps> = ({}) => {
  const [timer, setTimer] = useState("00:00");
  const { user } = useContext(userContext);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  useEffect(() => {
    if (!selectedExam) return;
    const loopover = setInterval(() => {
      const startTime = new Date(selectedExam.start_at.seconds * 1000);
      const timeLeft = Math.floor((startTime.getTime() - Date.now()) / 1000);

      if (timeLeft <= 0) {
        setTimer("00:00");
        clearInterval(loopover);
        return;
      }

      const formattedCountdown = secondsToHHMMSS(timeLeft);

      setTimer(formattedCountdown);
    }, 1000);

    return () => {
      clearInterval(loopover);
    };
  }, [selectedExam]);

  useEffect(() => {
    if (user) {
      fetchSelectedExamAPI().then((selectedExam) => {
        selectedExam && setSelectedExam(selectedExam);
      });
    }
  }, [user]);

  return <div>{timer}</div>;
};

export default memo(Countdown);
