import React, { memo, useEffect, useState } from "react";
import { BiTimeFive } from "react-icons/bi";
import { secondsToHHMMSS } from "../utils";

interface Props {
  className?: string;
  countdownFrom: Date;
}

export const CountDown: React.FC<Props> = ({ className, countdownFrom }) => {
  const [timer, setTimer] = useState("00:00:00");

  useEffect(() => {
    const loopover = setInterval(() => {
      const timeLeft = Math.floor((countdownFrom.getTime() - Date.now()) / 1000);
      if (timeLeft <= 0) {
        setTimer("00:00:00");
        clearInterval(loopover);
        return;
      }
      setTimer(secondsToHHMMSS(timeLeft));
    }, 1000);

    return () => {
      clearInterval(loopover);
    };
  }, []);

  return <span className={`${className}`}>{timer}</span>;
};

CountDown.defaultProps = {};

export default memo(CountDown);
