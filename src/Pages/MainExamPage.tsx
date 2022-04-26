import { memo, FC, useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router";
import { fetchExamQuestion, submitExamQuestion } from "../APIs/exam.api";
import QuestionCard from "../Components/AdmissionTest/QuestionCard";
import { ROUTE_HOMEPAGE } from "../constants.routes";
import { answer, Question } from "../Models/Question";

interface MainExamPageProps {}

const MainExamPage: FC<MainExamPageProps> = () => {
  const [selectedIteamHeight, setSelectedIteamHeight] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmiting, setIssubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [admissionQuestions, setAdmissionQuestions] = useState<Question[]>([]);

  const handleRef = useCallback((node) => {
    if (node !== null) {
      setSelectedIteamHeight(node.getBoundingClientRect().height);
    }
  }, []);

  const handleSlide = (questions: Question[]) => {
    setIsAnimating(true);

    setTimeout(() => {
      const [firstItem, ...newArray] = questions;
      setIsAnimating(false);
      setAdmissionQuestions(newArray);
      setIssubmitting(false);
    }, 500);
  };

  const handleSubmit = (answer: answer) => {
    setIssubmitting(true);
    setError("");
    submitExamQuestion(answer)
      .then(() => {
        setIssubmitting(false);

        setIsFetching(true);
        setError("");
        fetchExamQuestion()
          .then((response) => {
            if (!response) {
              setAdmissionQuestions([]);
            } else {
              setAdmissionQuestions([...admissionQuestions, response]);
              handleSlide([...admissionQuestions, response]);
            }
            setIsFetching(false);
          })
          .catch(() => {
            setError("Unable to fetch question! please try again.");
          });
      })
      .catch((error) => {
        setIssubmitting(false);
        setError("Unable to Submit your answer! please try again.");
        console.log(error);
      });
  };

  useEffect(() => {
    setIsFetching(true);
    setError("");
    fetchExamQuestion()
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
  // window.addEventListener("resize", () =>{
  //   console.log("hello")
  // })

  return (
    <div>
      {!isFetching && admissionQuestions.length === 0 ? (
        <Navigate to={ROUTE_HOMEPAGE} />
      ) : (
        <div className="flex justify-center items-center min-h-screen">
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
        </div>
      )}
    </div>
  );
};

export default memo(MainExamPage);
