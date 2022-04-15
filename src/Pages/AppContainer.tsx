import { FC, memo } from "react";
import { Outlet } from "react-router";

interface AppContainerProps {}

const AppContainer: FC<AppContainerProps> = ({}) => {
  return (
    <div className={`p-10`}>
      <Outlet />
    </div>
  );
};

export default memo(AppContainer);
