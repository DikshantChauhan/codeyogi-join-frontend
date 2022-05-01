import { useState, useEffect } from "react";
import { secondsToHHMMSS } from "../utils";

export const useCountdown = (countdownFrom: Date, options?: { enableReinitialization?: boolean; onCountDownFinish?: () => void }) => {
  const [timer, setTimer] = useState("00:00:00");
  const enableReinitialization = options?.enableReinitialization;
  const handleCountDownFinished = options?.onCountDownFinish;

  useEffect(() => {
    const loopover = setInterval(() => {
      const timeLeft = Math.floor((countdownFrom.getTime() - Date.now()) / 1000);
      if (timeLeft <= 0) {
        handleCountDownFinished && handleCountDownFinished();
        setTimer("00:00:00");
        clearInterval(loopover);
        return;
      }
      setTimer(secondsToHHMMSS(timeLeft));
    }, 1000);

    return () => {
      clearInterval(loopover);
    };
  }, [enableReinitialization ? countdownFrom : enableReinitialization]);

  return timer;
};
