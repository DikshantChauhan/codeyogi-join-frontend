import React, { memo, useEffect, useState } from "react";
import { BiTimeFive } from "react-icons/bi";
import { secondsToHHMMSS } from "../../utils";

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

  return (
    <div className={`flex rounded-md items-center sm:px-3 sm:py-3 px-1 py-2 bg-blue-600 text-white justify-center ${className}`}>
      <BiTimeFive className={`text-lg`} />
      <p className={`ml-1`}>{timer}</p>
    </div>
  );
};

CountDown.defaultProps = {};

export default memo(CountDown);
