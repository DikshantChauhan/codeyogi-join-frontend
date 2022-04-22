import { DateTime } from "luxon";
import { FC, memo, useState } from "react";
import { scheduleTest } from "../../APIs/cloudFunctions.api";
import { Exam } from "../../Models/Exam";
import ListItemCard from "../ListItemCard";
import ListItemCardButton from "../ListItemCardButton";

interface ExamCardProps {
  exam: Exam;
  className?: string;
}

const ExamCard: FC<ExamCardProps> = ({ exam, className }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleScheduleClick = async () => {
    setIsLoading(true);

    try {
      await scheduleTest({ id: exam.external_id });
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  const startDate = new Date(exam.start_at.seconds * 1000).toISOString();
  return (
    <>
      <ListItemCard heading={DateTime.fromISO(startDate).toLocaleString(DateTime.DATETIME_MED)} subheading={""} date={""} className={className}>
        <ListItemCardButton isLoading={isLoading} onClick={handleScheduleClick} type="button">
          Schedule
        </ListItemCardButton>
      </ListItemCard>
    </>
  );
};

export default memo(ExamCard);
