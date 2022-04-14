import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import Editor from "@uiw/react-textarea-code-editor";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  touched?: boolean;
  error?: string;
  fieldClasses?: string;
}

const CodeEditor: React.FC<Props> = ({ className, touched, error, fieldClasses, ...rest }) => {
  return (
    <div className={`relative overflow-visible sm:text-sm ${className}`}>
      <div className="flex mt-1 rounded-md shadow-sm">
        <Editor language="js" {...rest} className="w-full h-full" />
      </div>
      {touched && <p className={`absolute transform translate-y-full bottom-0 text-red-600 pt-1`}>{error}</p>}
    </div>
  );
};

CodeEditor.defaultProps = {};

export default React.memo(CodeEditor);
