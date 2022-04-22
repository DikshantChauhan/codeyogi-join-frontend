import { DateTime } from "luxon";
import { FC, memo, useState } from "react";
import { scheduleTest } from "../../APIs/cloudFunctions.api";
import { AdmissionTestEntity } from "../../Models/AdmissionTest";
import { secondsToHHMMSS } from "../../utils";
import ListItemCard from "../ListItemCard";
import ListItemCardButton from "../ListItemCardButton";

interface AdmissionTestCardProps {
  admissionTest: AdmissionTestEntity;
  className?: string;
}

const AdmissionTestCard: FC<AdmissionTestCardProps> = ({ admissionTest, className }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleScheduleClick = async () => {
    setIsLoading(true);

    try {
      await scheduleTest({ id: admissionTest.id });
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <>
      <ListItemCard
        heading={admissionTest.name}
        subheading={"Duration: " + secondsToHHMMSS(admissionTest.duration)}
        date={DateTime.fromISO(admissionTest.start_date).toLocaleString(DateTime.DATETIME_MED)}
        className={className}
      >
        <ListItemCardButton isLoading={isLoading} onClick={handleScheduleClick} type="button">
          Schedule
        </ListItemCardButton>
      </ListItemCard>
    </>
  );
};

export default memo(AdmissionTestCard);
