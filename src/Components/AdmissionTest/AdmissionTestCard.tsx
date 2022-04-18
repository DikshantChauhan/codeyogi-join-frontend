import { DateTime } from "luxon";
import { FC, memo } from "react";
import { AdmissionTestEntity } from "../../Models/AdmissionTest";
import { secondsToHHMMSS } from "../../utils";
import ListItemCard from "../ListItemCard";

interface AdmissionTestCardProps {
  admissionTest: AdmissionTestEntity;
  className?: string;
}

const AdmissionTestCard: FC<AdmissionTestCardProps> = ({ admissionTest, className }) => {
  return (
    <ListItemCard
      heading={admissionTest.name}
      subheading={"Duration: " + secondsToHHMMSS(admissionTest.duration)}
      date={DateTime.fromISO(admissionTest.start_date).toLocaleString(DateTime.DATETIME_MED)}
      indicator={""}
      indicatorLink={""}
      details={admissionTest.instructions}
      className={className}
    />
  );
};

export default memo(AdmissionTestCard);
