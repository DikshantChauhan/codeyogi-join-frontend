import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  touched?: boolean;
  error?: string;
  fieldClasses?: string;
  prefix?: string;
}

const Input: React.FC<Props> = ({ className, prefix, children, fieldClasses, touched, error, disabled, ...rest }) => {
  return (
    <div className={`relative overflow-visible sm:text-sm ${className}`}>
      <div className={`flex mt-1 rounded-md shadow-sm ${touched ? (error ? "mb-0" : "mb-1") : "mb-7"}`}>
        {prefix && (
          <span
            className={
              "inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-lg  sm:text-sm " +
              (disabled ? "bg-gray-400" : " bg-gray-50")
            }
          >
            {prefix}
          </span>
        )}

        <input
          {...rest}
          disabled={disabled}
          className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10  ${fieldClasses} ${
            disabled ? `bg-gray-400` : `bg-gray-50`
          }
            ${prefix ? `rounded-r-md` : `rounded-md`}
            `}
        />
      </div>

      {touched && <p className={`text-red-600 pt-1`}>{error}</p>}
    </div>
  );
};

Input.defaultProps = {};

export default React.memo(Input);
