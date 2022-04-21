import { FC, memo } from "react";

interface NotFoundProps {}

const NotFound: FC<NotFoundProps> = ({}) => {
  return <div>wrong route</div>;
};

export default memo(NotFound);
