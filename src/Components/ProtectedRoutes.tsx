import { FC, memo, useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { allowedRoutesContext } from "../Contexts/allowedRoutes.context";
import { isQuestionFetchableContext } from "../Contexts/isQuestionFetchable";
import { selectedExamContext } from "../Contexts/selectedExam.context";
import { userContext } from "../Contexts/user.contextt";
import NotFoundPage from "../Pages/NotFound.Page";
import { handleAllowedRoutes } from "../utils";

interface ProtectedRoutesProps {}

const ProtectedRoutes: FC<ProtectedRoutesProps> = ({}) => {
  const { allowedRoutes, setAllowedRoutes } = useContext(allowedRoutesContext);
  const { user } = useContext(userContext);
  const { selectedExam } = useContext(selectedExamContext);
  const currentRoute = window.location.pathname;
  const {isQuestionFetchable} = useContext(isQuestionFetchableContext)
  const navigate = useNavigate();

  useEffect(() => {
    handleAllowedRoutes(user, allowedRoutes, selectedExam, setAllowedRoutes, navigate, isQuestionFetchable);
  }, [user, allowedRoutes, selectedExam]);

  return allowedRoutes.find((allowedRoute) => currentRoute === allowedRoute) ? <Outlet /> : <NotFoundPage />;
};

export default memo(ProtectedRoutes);
