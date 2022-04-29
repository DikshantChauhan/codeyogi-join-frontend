import { addMinutes } from "date-fns";
import { memo, FC, useState, useEffect, useCallback, useContext } from "react";
import { Navigate } from "react-router";
import { fetchExamQuestionAPI, submitExamQuestionAPI } from "../APIs/exam.api";
import QuestionCard from "../Components/AdmissionTest/QuestionCard";
import { ROUTE_HOMEPAGE } from "../constants.routes";
import { selectedExamContext } from "../Contexts/selectedExam.context";
import { useCountdown } from "../Hooks/Countdown";
import { StudentAnswerOptions, StudentQuestion } from "../Models/StudentQuestion";

interface MainExamPageProps {}

const MainExamPage: FC<MainExamPageProps> = () => {
  const [selectedIteamHeight, setSelectedIteamHeight] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmiting, setIssubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [admissionQuestions, setAdmissionQuestions] = useState<StudentQuestion[]>([]);
  const { selectedExam } = useContext(selectedExamContext);
  const selectedExamOverTime = addMinutes(new Date(selectedExam!.start_at.seconds * 1000), 60);

  const timer = useCountdown(selectedExamOverTime);

  const handleRef = useCallback((node) => {
    if (node !== null) {
      setSelectedIteamHeight(node.getBoundingClientRect().height);
    }
  }, []);

  const handleSlide = (questions: StudentQuestion[]) => {
    setIsAnimating(true);

    setTimeout(() => {
      const [firstItem, ...newArray] = questions;
      setIsAnimating(false);
      setAdmissionQuestions(newArray);
      setIssubmitting(false);
    }, 500);
  };

  const handleSubmit = async (answer: StudentAnswerOptions) => {
    setIssubmitting(true);
    setError("");
    try {
      await submitExamQuestionAPI(answer);
    } catch (error) {
      setError("Unable to Submit your answer! please try again.");
      return;
    }

    setIssubmitting(false);

    setIsFetching(true);

    try {
      const newQuestion = await fetchExamQuestionAPI();
      if (!newQuestion) {
        setAdmissionQuestions([]);
      } else {
        setAdmissionQuestions([...admissionQuestions, newQuestion]);
        handleSlide([...admissionQuestions, newQuestion]);
      }
    } catch (error) {
      setError("Unable to fetch question! please try again.");
      return;
    }

    setIsFetching(false);
  };

  useEffect(() => {
    setIsFetching(true);
    setError("");
    fetchExamQuestionAPI()
      .then((response) => {
        if (!response) {
          setIsFetching(false);
          setAdmissionQuestions([]);
        } else {
          setAdmissionQuestions([...admissionQuestions, response]);
        }
      })
      .catch(() => {
        setError("Unable to fetch question! please try again.");
      });
  }, []);

  return !isFetching && admissionQuestions.length === 0 ? (
    <Navigate to={ROUTE_HOMEPAGE} />
  ) : (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <div className={`absolute top-5 right-5 p-2 border border-indigo-500 text-indigo-500 rounded-md`}>{timer}</div>

        <div className={`flex flex-col`}>
          <div style={{ height: `${selectedIteamHeight}px` }}>
            {admissionQuestions.map((question, index) => {
              const ref = index === 0 ? handleRef : null;
              const marginTop = index === 0 && isAnimating && `-${selectedIteamHeight}px`;

              return (
                <div
                  ref={ref}
                  key={index}
                  style={{ marginTop: marginTop || "0px" }}
                  className={`${isAnimating ? "transition-all duration-500" : ""}`}
                >
                  <QuestionCard isSubmitting={isSubmiting} trySubmit={handleSubmit} admissionQuestion={question} />
                </div>
              );
            })}
          </div>
          {error && <p className={`text-red-600`}> error {error}</p>}
        </div>
      </div>
    </div>
  );
};

export default memo(MainExamPage);
