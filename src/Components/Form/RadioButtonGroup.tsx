import { RadioGroup } from "@headlessui/react";
import React from "react";
import { connect } from "react-redux";
import { Question } from "../../models/Question";
import { quizSelectedAnswerAction } from "../../store/actions/quiz.actions";
import { quizQuestionSelector, quizSelectedAnswerSelector } from "../../store/selectors/quiz.selector";
import { AppState } from "../../store/store";

interface RadioButtonGroupProps {
  className?: string;
  quizSelectedAnswer?: { [key: string]: string };
  quizSelectedAnswerAction: (answer?: { [key: string]: string }) => {};
  question?: Question;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = (props) => {
  if (!props.question?.options) {
    return <p>Unable to fetch question</p>;
  }
  let options: any[] = [];
  Object.entries(props.question.options).forEach(([key, option], index) => {
    options.push(
      <RadioGroup.Option
        key={index}
        value={option}
        className={({ active, checked }) =>
          `${active ? "ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60" : ""}
                 ${checked ? "bg-black text-white" : "bg-white"} relative rounded-lg 
                 shadow-md px-5 py-4 cursor-pointer flex focus:outline-none ${props.className}`
        }
      >
        {({ checked }) => (
          <>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="text-sm">
                  <RadioGroup.Label as="p" className={`font-medium  ${checked ? "text-white" : "text-gray-900"}`}>
                    {key + ". " + option}
                  </RadioGroup.Label>
                </div>
              </div>
              {checked && (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                  <circle cx={12} cy={12} r={12} fill={checked ? "#fff" : "#000"} opacity="0.2" />
                  <path d="M7 13l3 3 7-7" stroke={checked ? "#fff" : "#000"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </>
        )}
      </RadioGroup.Option>
    );
  });
  return (
    <RadioGroup
      value={props.quizSelectedAnswer ? props.quizSelectedAnswer[Object.keys(props.quizSelectedAnswer)[0]] : undefined}
      onChange={(value) => {
        for (const key in props.question?.options) {
          if (props.question?.options[key] === value) {
            props.quizSelectedAnswerAction({ [key]: value! });
          }
        }
      }}
    >
      <RadioGroup.Label className={`font-semibold text-base`}>{props.question.title}</RadioGroup.Label>
      <div className="mt-4 space-y-2">{options}</div>
    </RadioGroup>
  );
};

RadioButtonGroup.defaultProps = {};

const mapStateToProps = (state: AppState) => {
  return {
    quizSelectedAnswer: quizSelectedAnswerSelector(state),
    question: quizQuestionSelector(state),
  };
};

const mapDispatchToProps = {
  quizSelectedAnswerAction,
};

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(RadioButtonGroup));
