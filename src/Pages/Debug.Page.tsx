import { DateTime } from "luxon";
import { FC, memo } from "react";
import AdmissionTestsPage from "./AdmissionTests.Page";

interface DebugProps {}

const Debug: FC<DebugProps> = ({}) => {
  return (
    <div>
      <AdmissionTestsPage />
    </div>
  );
};

export default memo(Debug);
