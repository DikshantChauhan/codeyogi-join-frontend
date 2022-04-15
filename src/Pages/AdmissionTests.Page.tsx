import { memo, FC, useState, useEffect } from "react";
import { fetchAdmissionTestListAPI } from "../APIs/admissionTest.api";
import AdmissionTestGrid from "../Components/AdmissionTest/AdmissionTestGrid";
import CountDown from "../Components/AdmissionTest/CountDown";
import { AdmissionTestEntity } from "../Models/AdmissionTest";

interface AdmissionTestsProps {}

const AdmissionTests: FC<AdmissionTestsProps> = ({}) => {
  const [admissionTests, setAdmissionTests] = useState<AdmissionTestEntity[]>([]);

  useEffect(() => {
    fetchAdmissionTestListAPI().then((admissionTests) => {
      setAdmissionTests(admissionTests);
    });
  }, []);

  return (
    <>
      <h1 className={`text-xl font-bold`}>Test for CodeYogi</h1>

      <AdmissionTestGrid admissionTests={admissionTests} />
    </>
  );
};

export default memo(AdmissionTests);
