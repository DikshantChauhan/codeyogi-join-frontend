import React from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
}

const NoticeText: React.FC<Props> = ({ className, children }) => {
  return <div className={`text-center mx-auto mt-10 px-2 text-2xl font-semibold max-w-3xl ${className}`}>{children}</div>;
};

NoticeText.defaultProps = {};

export default React.memo(NoticeText);
