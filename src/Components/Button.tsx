import React from "react";
import { IconType } from "react-icons/lib";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: any;
  Icon?: IconType;
}

const Button: React.FC<Props> = ({ className, Icon, children, ...rest }) => {
  return (
    <button
      {...rest}
      className={`relative flex justify-center border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 items-center focus:outline-none focus:ring-2 focus:ring-offset-2 m-1 group focus:ring-indigo-500 ${className}`}
    >
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        {Icon && <Icon className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" aria-hidden="true" />}
      </span>
      <div className={Icon ? "ml-6" : ""}>{children}</div>
    </button>
  );
};

Button.defaultProps = {};

export default React.memo(Button);
