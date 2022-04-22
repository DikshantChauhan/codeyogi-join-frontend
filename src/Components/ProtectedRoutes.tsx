import { FC, memo, useContext } from "react";
import { Outlet, useNavigate } from "react-router";
import { allowedRoutesContext } from "../Contexts/allowedRoutes.context";
import { userContext } from "../Contexts/user.contextt";
import NotFoundPage from "../Pages/NotFound.Page";
import { handleAllowedRoutes } from "../utils";

interface ProtectedRoutesProps {}

const ProtectedRoutes: FC<ProtectedRoutesProps> = ({}) => {
  const { allowedRoutes, setAllowedRoutes } = useContext(allowedRoutesContext);
  const { user } = useContext(userContext);
  const currentRoute = window.location.pathname;
  const navigate = useNavigate();

  handleAllowedRoutes(user, allowedRoutes, setAllowedRoutes, navigate);

  return allowedRoutes.find((allowedRoute) => currentRoute === allowedRoute) ? <Outlet /> : <NotFoundPage />;
};

export default memo(ProtectedRoutes);
