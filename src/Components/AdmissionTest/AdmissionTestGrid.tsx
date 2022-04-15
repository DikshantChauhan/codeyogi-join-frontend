import { memo, FC } from "react";
import { AdmissionTestEntity } from "../../Models/AdmissionTest";
import AdmissionTestCard from "./AdmissionTestCard";
import AdmissionTestCardWithCountdown from "./AdmissionTestCardWithCountdown";

interface AdmissionTestGridProps {
  admissionTests: AdmissionTestEntity[];
}

const AdmissionTestGrid: FC<AdmissionTestGridProps> = ({ admissionTests }) => {
  console.log(admissionTests);
  return (
    <div className="flex items-center justify-center px-4 py-4 mt-2 bg-gray-50 sm:px-6 lg:px-8">
      <div className="flex flex-wrap w-full mx-auto space-x-2 space-y-2 ">
        {admissionTests.map((admissionTest, i) => {
          return i === 0 ? (
            <AdmissionTestCardWithCountdown className={`mt-2`} admissionTest={admissionTest} key={admissionTest.id} />
          ) : (
            <AdmissionTestCard admissionTest={admissionTest} key={admissionTest.id} />
          );
        })}
      </div>
    </div>
  );
};

export default memo(AdmissionTestGrid);
