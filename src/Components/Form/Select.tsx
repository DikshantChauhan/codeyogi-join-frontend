import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string | number; label: string }[];
  error?: string;
  touched?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ options, error, touched, placeholder, className, ...rest }) => {
  return (
    <div className={`relative overflow-visible ${className}`}>
      <select
        {...rest}
        className={`relative w-full text-sm bg-white border-gray-300 rounded-md cursor-pointer focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 overflow-visible ${
          touched && error ? "mb-0" : "mb-6"
        }`}
      >
        <option value="" disabled hidden>
          {placeholder ? placeholder : "Select an option"}
        </option>

        {options.map((option, index) => {
          return (
            <option value={option.value} key={index}>
              {option.label}
            </option>
          );
        })}
      </select>

      {touched && <p className={` text-red-600 pt-1`}>{error}</p>}
    </div>
  );
};

Select.defaultProps = {};

export default React.memo(Select);
