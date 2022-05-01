import { RadioGroup } from "@headlessui/react";
import { useFormik } from "formik";
import { memo, FC } from "react";
import * as yup from "yup";
import { HiCheck } from "react-icons/hi";
import SubmitButton from "../SubmitButton";
import { StudentAnswerOptions, StudentQuestion } from "../../Models/StudentQuestion";

interface QuestioinCardProps {
  admissionQuestion: StudentQuestion;
  isSubmitting: boolean;
  isAnimating?: boolean;
  trySubmit: (answer: StudentAnswerOptions) => Promise<void>;
}

const QuestionCard: FC<QuestioinCardProps> = ({ admissionQuestion, isSubmitting, trySubmit, isAnimating }) => {
  const formik = useFormik<{ userAnswer: StudentAnswerOptions }>({
    initialValues: { userAnswer: null },

    validationSchema: yup.object().shape({ userAnswer: yup.string().required() }),

    onSubmit: async (data) => {
      await trySubmit(data.userAnswer);
      formik.setValues(formik.initialValues);
    },
    // validateOnMount: true,
  });

  return (
    <div className="max-w-lg p-2 py-6 mx-auto min-w-xxs">
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-2">
          <h2 className="font-bold">#{admissionQuestion.id}.</h2>
          <p>{admissionQuestion.questionText}</p>
        </div>
        <RadioGroup value={formik.values.userAnswer} onChange={async (value) => await formik.setValues({ userAnswer: value })}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="pb-2 space-y-2">
            {Object.entries(admissionQuestion.options).map((option) => {
              return (
                <RadioGroup.Option
                  key={option[0]}
                  value={option[0]}
                  className={({ active, checked }) =>
                    `${active ? "ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60" : ""}
                  ${checked ? "bg-blue-900 bg-opacity-75 text-white" : "bg-white"}
                    relative rounded-lg shadow-md px-5 py-4 cursor-pointer flex focus:outline-none`
                  }
                >
                  {({ active, checked }) => (
                    <>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <RadioGroup.Label as="p" className={`font-medium  ${checked ? "text-white" : "text-gray-900"}`}>
                              {option[1]}
                            </RadioGroup.Label>
                          </div>
                        </div>
                        {checked && (
                          <div className="flex-shrink-0 text-white">
                            <HiCheck className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </RadioGroup.Option>
              );
            })}
          </div>
        </RadioGroup>
        {isSubmitting || isAnimating ? (
          <p className="text-center">Loading new Question...</p>
        ) : (
          <div className="flex justify-between">
            <SubmitButton className={`p4 flex-1 ${formik.values.userAnswer ? "" : "cursor-not-allowed"}`} name="next" type="submit" disabled={true}>
              Save and next
            </SubmitButton>
            <SubmitButton
              className="flex-1 p-4"
              name="skip"
              type="submit"
              onClick={(e) => {
                formik.setValues({ userAnswer: "pass" });
              }}
            >
              {" "}
              Skip
            </SubmitButton>
          </div>
        )}
      </form>
    </div>
  );
};

export default memo(QuestionCard);
