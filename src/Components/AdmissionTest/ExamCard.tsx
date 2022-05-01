import { DateTime } from "luxon";
import { FC, memo, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { scheduleTestAPI } from "../../APIs/cloudFunctions.api";
import { Exam } from "../../Models/Exam";

interface ExamCardProps {
  exam: Exam;
  className?: string;
}

const ExamCard: FC<ExamCardProps> = ({ exam, className }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleScheduleClick = async () => {
    setIsLoading(true);

    try {
      await scheduleTestAPI({ id: exam.external_id });
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  const startDate = new Date(exam.start_at.seconds * 1000).toISOString();
  return (
    <li className={`flex justify-between items-center pl-2 border-2 border-gray-100 bg-white rounded-lg shadow-lg list-none ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 truncate">
        &nbsp; <span className="text-gray-500">{DateTime.fromISO(startDate).toLocaleString(DateTime.DATETIME_MED)}</span>
      </h3>

      <button
        className={`p-3 bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white border border-transparent rounded-br-lg flex justify-center items-center`}
        onClick={handleScheduleClick}
      >
        <span className="ml-1 sm:ml-3">{isLoading ? <FaSpinner className={`animate-spin text-black w-5 h-5`} /> : "Schedule"}</span>
      </button>
    </li>
  );
};

export default memo(ExamCard);
