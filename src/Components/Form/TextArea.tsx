import React from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  touched?: boolean;
  error?: string;
  fieldClasses?: string;
}

const Input: React.FC<Props> = ({ className, children, fieldClasses, touched, error, disabled, ...rest }) => {
  return (
    <div className={`relative overflow-visible sm:text-sm ${className}`}>
      <div className="flex mt-1 rounded-md shadow-sm">
        <textarea
          disabled={disabled}
          className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10  ${fieldClasses} ${ disabled ? `bg-gray-400` : `bg-gray-50`}`}
          {...rest}
        />
      </div>
      {touched && <p className={`absolute transform translate-y-full bottom-0 text-red-600 pt-1`}>{error}</p>}
    </div>
  );
};

Input.defaultProps = {};

export default React.memo(Input);
