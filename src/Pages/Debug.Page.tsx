import { FC, memo } from "react";
import ExamsPage from "./Exams.Page";
import { test } from "../APIs/cloudFunctions.api";

interface DebugProps {}

const Debug: FC<DebugProps> = ({}) => {
  return (
    <div>
      <button
        onClick={() => {
          test({ id: 2 })
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }}
      >
        testing
      </button>
      <ExamsPage />
    </div>
  );
};

export default memo(Debug);
