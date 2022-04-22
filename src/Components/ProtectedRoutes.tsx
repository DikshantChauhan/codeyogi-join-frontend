import { FC, memo, useContext } from "react";
import { Outlet } from "react-router";
import { allowedRoutesContext } from "../Contexts/allowedRoutes.context";
import { userContext } from "../Contexts/user.contextt";
import NotFoundPage from "../Pages/NotFound.Page";
import { handleAllowedRoutes } from "../utils";

interface ProtectedRoutesProps {}

const ProtectedRoutes: FC<ProtectedRoutesProps> = ({}) => {
  const { allowedRoutes, setAllowedRoutes } = useContext(allowedRoutesContext);
  const { user } = useContext(userContext);
  const currentRoute = window.location.pathname;

  handleAllowedRoutes(user, allowedRoutes, setAllowedRoutes);

  return allowedRoutes.find((allowedRoute) => currentRoute === allowedRoute) ? <Outlet /> : <NotFoundPage />;
};

export default memo(ProtectedRoutes);
