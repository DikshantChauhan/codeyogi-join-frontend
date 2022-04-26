import React from "react";

interface Props {
  className?: string;
  children?: string;
}

const ErrorMsg: React.FC<Props> = ({ className, children }) => {
  return <>{children && <p className={`${className} text-red-500`}>{children}</p>}</>;
};

ErrorMsg.defaultProps = {};

export default React.memo(ErrorMsg);
