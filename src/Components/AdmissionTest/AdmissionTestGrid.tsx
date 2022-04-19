import { memo, FC } from "react";
import { AdmissionTestEntity } from "../../Models/AdmissionTest";
import AdmissionTestCard from "./AdmissionTestCard";

interface AdmissionTestGridProps {
  admissionTests: AdmissionTestEntity[];
}

const AdmissionTestGrid: FC<AdmissionTestGridProps> = ({ admissionTests }) => {
  return (
    <div className="flex items-center justify-center px-4 py-4 mt-2 bg-gray-50 sm:px-6 lg:px-8">
      <div className="flex flex-wrap w-full mx-auto space-x-2 space-y-2 ">
        {admissionTests.map((admissionTest, i) => (
          <AdmissionTestCard admissionTest={admissionTest} className={`${i === 0 ? "mt-2 ml-2" : ""} flex-1 `} key={admissionTest.id} />
        ))}
      </div>
    </div>
  );
};

export default memo(AdmissionTestGrid);
