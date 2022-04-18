import React, { useEffect, useState } from "react";

import Button from "../Button";
import FormikField from "./FormikField";

interface VariableInputsProps {
  defaultCount: number;
  removeOnClick?: () => void;
  addOnClick?: () => void;
  minimumInputs: number;
  prefix: "alphabets" | "numbers" | ((i: number) => any) | string[];
  placeholder: string;
  name: string;
  buttonText?: string;
  showButtons: boolean;
  className?: string;
}

const VariableInputs: React.FC<VariableInputsProps> = ({
  defaultCount,
  removeOnClick,
  addOnClick,
  minimumInputs,
  prefix,
  placeholder,
  name,
  buttonText,
  showButtons,
  className,
}) => {
  let inputs: any[] = [];
  const [count, setCount] = useState(defaultCount);

  useEffect(() => {
    setCount(defaultCount);
  }, [defaultCount]);

  for (let i = 0; i < count; i++) {
    let key;
    if (typeof prefix === "function") {
      key = prefix(i);
    } else {
      switch (prefix) {
        case "alphabets":
          key = String.fromCharCode(65 + i);
          break;

        case "numbers":
          key = i;
          break;

        default:
          key = prefix[i];
          break;
      }
    }
    inputs.push(<FormikField key={i} prefix={key} name={`${name}.${key}`} type="text" placeholder={`${placeholder} ${key}`} />);
  }
  return (
    <>
      <div className={`grid grid-cols-2 gap-4 ${className}`}>{inputs}</div>

      {showButtons && (
        <div className={`flex justify-between`}>
          <Button
            className={`py-2 px-4`}
            type="button"
            onClick={() => {
              if (count <= minimumInputs) return;
              removeOnClick && removeOnClick();
              setCount((option) => option - 1);
            }}
          >
            Remove {buttonText}
          </Button>

          <Button
            className={`py-2 px-4`}
            type="button"
            onClick={() => {
              addOnClick && addOnClick();
              setCount((option) => option + 1);
            }}
          >
            Add {buttonText}
          </Button>
        </div>
      )}
    </>
  );
};

export default React.memo(VariableInputs);
