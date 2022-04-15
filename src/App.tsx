import { FC, memo } from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTE_SIGN_IN } from "./constants.routes";
import SignInPage from "./Pages/SignIn.Page";

interface AppProps {}

const App: FC<AppProps> = () => {
  return (
    <Routes>
      <Route path={ROUTE_SIGN_IN} element={<SignInPage />} />
    </Routes>
  );
};

App.defaultProps = {};

export default memo(App);
