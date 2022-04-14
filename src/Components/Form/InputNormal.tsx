import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  labelText: string;
}

const InputNormal: React.FC<Props> = ({ className, labelText, ...rest }) => {
  return (
    <div className={`${className}`}>
      {rest.id && (
        <label htmlFor={rest.id} className="sr-only">
          {labelText}
        </label>
      )}
      <input {...rest} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
  );
};

InputNormal.defaultProps = {};

export default React.memo(InputNormal);
