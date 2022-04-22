import { memo, FC } from "react";
import { Exam } from "../../Models/Exam";
import ExamCard from "./ExamCard";

interface AdmissionTestGridProps {
  exams: Exam[];
}

const AdmissionTestGrid: FC<AdmissionTestGridProps> = ({ exams }) => {
  return (
    <div className="flex items-center justify-center px-4 py-4 mt-2 bg-gray-50 sm:px-6 lg:px-8">
      <div className="flex flex-wrap w-full mx-auto space-x-2 space-y-2 ">
        {exams.map((exam, i) => (
          <ExamCard exam={exam} className={`${i === 0 ? "mt-2 ml-2" : ""} flex-1 max-w-xs`} key={i} />
        ))}
      </div>
    </div>
  );
};

export default memo(AdmissionTestGrid);
