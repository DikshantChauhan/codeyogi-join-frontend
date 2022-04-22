import { FC, memo } from "react";
import ExamsPage from "./Exams.Page";

interface DebugProps {}

const Debug: FC<DebugProps> = ({}) => {
  return (
    <div>
      <ExamsPage />
    </div>
  );
};

export default memo(Debug);
