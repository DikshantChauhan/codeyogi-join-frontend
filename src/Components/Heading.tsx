import { FC, memo } from "react";

interface HeadingProps {
  className?: string;
  children?: any;
}

const Heading: FC<HeadingProps> = ({ className, children }) => {
  return <h1 className={`mt-5 text-3xl font-semibold ${className}`}>{children}</h1>;
};

export default memo(Heading);
