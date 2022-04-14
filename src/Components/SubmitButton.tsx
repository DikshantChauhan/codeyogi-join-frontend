import React from "react";
import { IconType } from "react-icons";
import { FaSpinner } from "react-icons/fa";
import Button from "./Button";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  Icon?: IconType;
  isLoading?: boolean;
}

const SubmitButton: React.FC<Props> = ({ className, Icon, isLoading, children, ...rest }) => {
  return (
    <Button Icon={Icon} className={`py-2 px-4 ${className}`} type="submit" {...rest} disabled={isLoading ? true : false}>
      {!isLoading ? children : <FaSpinner className={`animate-spin text-white w-5 h-5 mx-auto`} />}
    </Button>
  );
};

SubmitButton.defaultProps = {};

export default React.memo(SubmitButton);
