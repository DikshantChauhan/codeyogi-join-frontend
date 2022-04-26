import { FC, memo } from "react";
import { Outlet } from "react-router";
import Navbar from "./Navbar/Navbar";

interface AppContainerProps {}

const AppContainer: FC<AppContainerProps> = ({}) => {
  return (
    <div>
      <Navbar />

      <Outlet />
    </div>
  );
};

export default memo(AppContainer);
