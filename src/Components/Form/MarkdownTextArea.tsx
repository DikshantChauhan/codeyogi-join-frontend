import MDEditor from "@uiw/react-md-editor";
import React from "react";
import { connect } from "react-redux";
import { AppState } from "../../store/store";

interface MarkdownTextAreaProps {
  className?: string;
  touched: boolean;
  error: string;
  fieldClasses?: string;
  prefix?: string;
  onChange: (value?: string) => void;
  onBlur: () => void;
  value: string;
}

const MarkdownTextArea: React.FC<MarkdownTextAreaProps> = ({ touched, error, onChange, onBlur, value, className, fieldClasses }) => {
  return (
    <div className={`${className}`}>
      <MDEditor className={`${error && touched ? "mb-0" : "mb-7"} ${fieldClasses}`} value={value} onChange={onChange} onBlur={onBlur} />

      {touched && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = {};

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(MarkdownTextArea));
