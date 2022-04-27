import { memo, FC } from "react";
import { Exam } from "../../Models/Exam";
import ExamCard from "./ExamCard";

interface AdmissionTestGridProps {
  exams: Exam[];
}

const AdmissionTestGrid: FC<AdmissionTestGridProps> = ({ exams }) => {
  return (
    <div>
      {exams.map((exam, i) => (
        <ExamCard exam={exam} className={`mx-auto max-w-2xl my-2`} key={i} />
      ))}
    </div>
  );
};

export default memo(AdmissionTestGrid);
