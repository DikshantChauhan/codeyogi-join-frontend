import { memo, FC, useState, useEffect, useCallback } from "react";
import { fetchExamQuestion, submitExamQuestion } from "../APIs/exam.api";
import QuestionCard from "../Components/AdmissionTest/QuestionCard";
import { answer, Question } from "../Models/Question";

interface MainExamPageProps {}

const MainExamPage: FC<MainExamPageProps> = () => {
  const [selectedIteamHeight, setSelectedIteamHeight] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmiting, setIssubmitting] = useState(false);
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
    submitExamQuestion(answer)
      .then(() => {
        fetchExamQuestion().then((response) => {
          if (!response) return;
          setAdmissionQuestions([...admissionQuestions, response]);
          handleSlide([...admissionQuestions, response]);
        });
      })
      .catch((error) => {
        //handle answer not submitt
        console.log(error);
      });
  };

  useEffect(() => {
    fetchExamQuestion().then((response) => {
      if (!response) return;
      setAdmissionQuestions([...admissionQuestions, response]);
    });
  }, []);

  return (
    <div>
      <div style={{ height: `${selectedIteamHeight}px` }} className="fixed transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        {admissionQuestions.map((question, index) => {
          const ref = index === 0 ? handleRef : null;
          const marginTop = index === 0 && isAnimating && `-${selectedIteamHeight}px`;
          return (
            <div ref={ref} key={index} style={{ marginTop: marginTop || "0px" }} className={`${isAnimating ? "transition-all duration-500" : ""}`}>
              <QuestionCard isSubmitting={isSubmiting} trySubmit={handleSubmit} admissionQuestion={question} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(MainExamPage);
