import { FC, memo, useContext } from "react";
import { Outlet, Navigate } from "react-router";
import { ROUTE_FORWARD_SLASH } from "../constants.routes";
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
  if (currentRoute === ROUTE_FORWARD_SLASH) return <Navigate to={allowedRoutes[0]} />;

  return allowedRoutes.find((allowedRoute) => currentRoute === allowedRoute) ? <Outlet /> : <NotFoundPage />;
};

export default memo(ProtectedRoutes);
