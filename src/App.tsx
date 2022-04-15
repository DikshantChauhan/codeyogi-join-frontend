import { FC, memo } from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTE_DEBUG, ROUTE_FORWARD_SLASH, ROUTE_SIGN_IN } from "./constants.routes";
import AppContainer from "./Pages/AppContainer";
import DebugPage from "./Pages/Debug.Page";
import SignInPage from "./Pages/SignIn.Page";

interface AppProps {}

const App: FC<AppProps> = () => {
  return (
    <Routes>
      <Route path={ROUTE_SIGN_IN} element={<SignInPage />} />
      <Route path={ROUTE_FORWARD_SLASH} element={<AppContainer />}>
        <Route path={ROUTE_DEBUG} element={<DebugPage />} />
      </Route>
    </Routes>
  );
};

App.defaultProps = {};

export default memo(App);
