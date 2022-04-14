import { Field, FieldAttributes } from "formik";
import React from "react";

interface FormikFieldProps extends FieldAttributes<any> {
  className?: string;
  fieldClasses?: string;
  prefix?: string;
  disabled?: boolean;
}

const FormikField: React.FC<FormikFieldProps> = ({ className, prefix, disabled, fieldClasses, children, ...rest }) => {
  return (
    <div className={`relative sm:text-sm ${className}`}>
      <div className="flex mt-1 rounded-md shadow-sm">
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

        <Field
          disabled={disabled}
          className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${
            prefix ? "rounded-r-md" : "rounded-md"
          }  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10  ${fieldClasses} ${disabled ? `bg-gray-400` : `bg-gray-50`}`}
          {...rest}
        />
      </div>
    </div>
  );
};

FormikField.defaultProps = {};

export default React.memo(FormikField);
