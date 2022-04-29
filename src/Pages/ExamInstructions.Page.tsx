import { memo, FC, useContext } from "react";
import { ROUTE_HOMEPAGE } from "../constants.routes";
import { Navigate } from "react-router-dom";
import { selectedExamContext } from "../Contexts/selectedExam.context";
import { getExamStartAt, HHMMSSToSeconds, isExamOver } from "../utils";
import MDEditor from "@uiw/react-md-editor";
import { useCountdown } from "../Hooks/Countdown";
import Button from "../Components/Button";
import { startExamAPI } from "../APIs/exam.api";

interface ExamInstructionsPageProps {}

const ExamInstructionsPage: FC<ExamInstructionsPageProps> = () => {
  const { selectedExam } = useContext(selectedExamContext);
  const examStartTime = getExamStartAt(selectedExam!);

  const timer = useCountdown(examStartTime);
  const secondsLeft = HHMMSSToSeconds(timer);
  return (
    <div className="h-screen px-4 py-4 mt-2 bg-gray-50 sm:px-6 lg:px-8">
      <MDEditor.Markdown
        prefixCls="bg-gray-50"
        source="***some markdown text here*** 
        >``` 1. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero voluptatem totam dicta iure ratione harum repellendus facere possimus```
        ----------
        2. laudantium iusto ducimus itaque quibusdam deleniti explicabo dolores animi ex earum voluptatem delectus rerum odio perspiciatis? Molestias aspernatur voluptatibus, 
        - _3. dicta exercitationem error dolores sit tenetur corporis ipsum earum aliquid._
        - ~~some markdown text here~~"
      />

      <div className={`ml-auto w-fit border border-indigo-500 p-2 border-opacity-25 rounded-md`}>
        {secondsLeft ? (
          <h1>
            <span>Exam will start in </span>
            <span>{timer}</span>
          </h1>
        ) : isExamOver(selectedExam!) ? (
          <Navigate to={ROUTE_HOMEPAGE} />
        ) : (
          <div>
            <h1>Exam is going on</h1>
            <Button
              className={`px-2 py-1`}
              onClick={async () => {
                await startExamAPI();
              }}
            >
              Start
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ExamInstructionsPage);
