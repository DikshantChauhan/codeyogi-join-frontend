import { memo, FC, useState, useEffect, useCallback, useContext, useMemo } from "react";
import { Navigate, useNavigate } from "react-router";
import { fetchExamQuestionAPI, submitExamQuestionAPI } from "../APIs/exam.api";
import QuestionCard from "../Components/AdmissionTest/QuestionCard";
import { ROUTE_EXAM, ROUTE_FORWARD_SLASH, ROUTE_HOMEPAGE } from "../constants.routes";
import { allowedRoutesContext } from "../Contexts/allowedRoutes.context";
import { isQuestionFetchableContext } from "../Contexts/isQuestionFetchable";
import { selectedExamContext } from "../Contexts/selectedExam.context";
import { userContext } from "../Contexts/user.contextt";
import { useCountdown } from "../Hooks/Countdown";
import { StudentAnswerOptions, StudentQuestion } from "../Models/StudentQuestion";
import { getExamEndAt, handleAllowedRoutes, isQuestionSubmitable } from "../utils";

interface MainExamPageProps {}

const MainExamPage: FC<MainExamPageProps> = () => {
  const [selectedIteamHeight, setSelectedIteamHeight] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmiting, setIssubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [admissionQuestions, setAdmissionQuestions] = useState<StudentQuestion[]>([]);
  const { selectedExam } = useContext(selectedExamContext);
  const examEndAt = getExamEndAt(selectedExam!);
  const { allowedRoutes, setAllowedRoutes } = useContext(allowedRoutesContext);
  const navigate = useNavigate();
  const [isCoolDownVisible, setIsCoolDownVisible] = useState(false);
  const { user } = useContext(userContext);
  const { setIsQuestionFetchable } = useContext(isQuestionFetchableContext);

  const countDownValue = useMemo(() => {
    return admissionQuestions[0]?.submitableAfter || new Date();
  }, [isCoolDownVisible]);
  const handleCoolDownFinished = useCallback(() => {
    setIsCoolDownVisible(false);
  }, []);
  const coolDownTimer = useCountdown(countDownValue, { enableReinitialization: true, onCountDownFinish: handleCoolDownFinished });

  const handleExamFinished = useCallback(() => {
    const currentAllowedRoutes = [...allowedRoutes].filter((route) => route !== ROUTE_EXAM);
    currentAllowedRoutes.unshift(ROUTE_HOMEPAGE);
    setAllowedRoutes(currentAllowedRoutes);
    navigate(ROUTE_HOMEPAGE);
  }, [allowedRoutes]);
  const ExamEndAtCountDown = useCountdown(examEndAt, { onCountDownFinish: handleExamFinished });

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
    //check if question is submitable
    const question = admissionQuestions[0];
    if (!isQuestionSubmitable(question)) {
      setIsCoolDownVisible(true);
      return;
    }
    setIsCoolDownVisible(false);

    //submit answer
    setIssubmitting(true);
    setError("");
    try {
      await submitExamQuestionAPI(answer, question.id);
    } catch (error) {
      setError("Unable to Submit your answer! please try again.");
      return;
    }
    setIssubmitting(false);

    //fetch new question
    setIsFetching(true);
    try {
      const newQuestion = await fetchExamQuestionAPI(selectedExam!);
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
    fetchExamQuestionAPI(selectedExam!)
      .then((response) => {
        if (!response) {
          setAdmissionQuestions([]);
        } else {
          setAdmissionQuestions([...admissionQuestions, response]);
        }
      })
      .catch(() => {
        setError("Unable to fetch question! please try again.");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  if (!isFetching && admissionQuestions.length === 0) {
    setIsQuestionFetchable(false);
    handleAllowedRoutes(user, allowedRoutes, selectedExam, setAllowedRoutes, navigate);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className={`flex flex-col pt-12 relative`}>
        <div className="absolute flex justify-between top-1 left-1 right-1">
          {isCoolDownVisible && <div className={`p-2 border border-red-500 text-red-500 rounded-md max-w-max flex-1`}>{coolDownTimer}</div>}
          <div className={`p-2 border border-indigo-500 text-indigo-500 rounded-md max-w-max ml-auto`}>{ExamEndAtCountDown}</div>
        </div>
        <div style={{ height: `${selectedIteamHeight}px` }}>
          {admissionQuestions.map((question, index) => {
            const ref = index === 0 ? handleRef : null;
            const marginTop = index === 0 && isAnimating && `-${selectedIteamHeight}px`;

            return (
              <div
                ref={ref}
                key={index + question.id}
                style={{ marginTop: marginTop || "0px" }}
                className={`${isAnimating ? "transition-all duration-500" : ""}`}
              >
                <QuestionCard isSubmitting={isSubmiting} trySubmit={handleSubmit} admissionQuestion={question} isAnimating={isAnimating} />
              </div>
            );
          })}
        </div>
        {error ||
          (isCoolDownVisible && <p className={`text-red-600 text-center`}> error: {isCoolDownVisible ? "You reached Submission limit!" : error}</p>)}
      </div>
    </div>
  );
};

export default memo(MainExamPage);
