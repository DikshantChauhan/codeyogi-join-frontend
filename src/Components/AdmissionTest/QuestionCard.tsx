import { RadioGroup } from "@headlessui/react";
import { useFormik } from "formik";
import { memo, FC } from "react";
import * as yup from "yup";
import { Question } from "../../Models/Question";
import { HiCheck } from "react-icons/hi";
import Button from "../Button";
import SubmitButton from "../SubmitButton";

interface QuestioinCardProps {
  admissionQuestion: Question;
  isSubmitting: boolean;
  trySubmit: (answer: "A" | "B" | "C" | "D" | "pass") => void;
}

const QuestionCard: FC<QuestioinCardProps> = ({ admissionQuestion, isSubmitting, trySubmit }) => {
    console.log(admissionQuestion)
  const formik = useFormik({
    initialValues: { userAnswer: "" },
    validationSchema: yup.object().shape({ userAnswer: yup.string().required() }),
    onSubmit: (data) => {
      trySubmit(data.userAnswer as "A" | "B" | "C" | "D" | "pass");
    },
    // validateOnMount: true,
  });

  return (
    <div className="w-full max-w-md p-2 py-6 mx-auto">
      <h2>{admissionQuestion.questionText}</h2>

      <form onSubmit={formik.handleSubmit}>
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
        {isSubmitting ? (
          <p className="text-center">Loading new Question...</p>
        ) : (
          <div className="flex justify-between">
            <Button
              className={`p4 flex-1 ${formik.values.userAnswer ? "" : "cursor-not-allowed"}`}
              name="next"
              type="submit"
              disabled={true}
              onClick={(e) => {
                console.log("save button clicked");
              }}
            >
              Save and next
            </Button>
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
