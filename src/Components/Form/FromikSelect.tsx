import { Field, FieldAttributes } from "formik";
import React from "react";
import { connect } from "react-redux";
import { AppState } from "../../store/store";

interface FromikSelectProps extends FieldAttributes<any> {
  options: string[];
  error?: string;
  touched?: boolean;
  className?: string;
}

const FromikSelect: React.FC<FromikSelectProps> = ({ options, error, touched, placeholder, className, ...rest }) => {
  return (
    <div className={`relative ${className}`}>
      <Field
        as="select"
        {...rest}
        className="relative w-full h-full text-sm bg-white border-gray-300 rounded-md cursor-pointer focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
      >
        <option value="" disabled hidden>
          {placeholder ? placeholder : "Select an option"}
        </option>

        {options.map((option, index) => {
          return <option key={index}>{option}</option>;
        })}
      </Field>

      {touched && <p className={`absolute bottom-0 transform translate-y-full text-red-600 left-3 pt-1`}>{error}</p>}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = {};

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(FromikSelect));
