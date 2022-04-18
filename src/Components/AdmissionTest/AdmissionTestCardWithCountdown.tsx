import { FC, memo, useEffect, useState } from "react";
import { AdmissionTestEntity } from "../../Models/AdmissionTest";
import { secondsToHHMMSS } from "../../utils";
import ListItemCard from "../ListItemCard";

interface AdmissionTestCardWithCountdownProps {
  admissionTest: AdmissionTestEntity;
  className?: string;
}

const AdmissionTestCardWithCountdown: FC<AdmissionTestCardWithCountdownProps> = ({ admissionTest, className }) => {
  const [timer, setTimer] = useState("00:00:00");

  useEffect(() => {
    const loopover = setInterval(() => {
      const timeLeft = Math.floor((new Date(admissionTest.start_date).getTime() - Date.now()) / 1000);
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
    <ListItemCard
      heading={admissionTest.name}
      subheading={"Duration: " + secondsToHHMMSS(admissionTest.duration)}
      date={`Starting in ${timer}`}
      indicator={""}
      indicatorLink={""}
      details={admissionTest.instructions}
      className={className}
    />
  );
};

export default memo(AdmissionTestCardWithCountdown);
