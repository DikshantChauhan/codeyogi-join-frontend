import { FC, memo } from "react";

interface NotFoundProps {}

const NotFound: FC<NotFoundProps> = ({}) => {
  return <h1 className={`text-3xl text-red-600`}>wrong route</h1>;
};

export default memo(NotFound);
