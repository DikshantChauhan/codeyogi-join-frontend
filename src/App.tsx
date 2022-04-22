import { FC, memo, useContext, useEffect, useMemo, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ROUTE_DEBUG, ROUTE_PROFILE, ROUTE_LOGIN, ROUTE_SLOTS, ROUTE_FORWARD_SLASH, ROUTE_HOMEPAGE } from "./constants.routes";
import SignInPage from "./Pages/SignIn.Page";
import { authentication, db } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "./Models/User";
import CompleteProfilePage from "./Pages/CompleteProfile.Page";
import DebugPage from "./Pages/Debug.Page";
import { signOut } from "./APIs/auth.api";
import { handleAuthChanges, handleMeChanges } from "./utils";
import AdmissionTestsPage from "./Pages/AdmissionTests.Page";
import { query, collection, where, limit, onSnapshot } from "firebase/firestore";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import NotFoundPage from "./Pages/NotFound.Page";
import { userContext } from "./Contexts/user.contextt";
import { allowedRoutesContext } from "./Contexts/allowedRoutes.context";
import AppContextProvider from "./Components/AppContext.Provider";

interface AppProps {}

const App: FC<AppProps> = () => {
  const [isUserFetching, setIsUserFetching] = useState(true);
  const { user, setUser } = useContext(userContext);
  const { allowedRoutes, setAllowedRoutes } = useContext(allowedRoutesContext);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubAuthObserver = onAuthStateChanged(authentication, (me) => {
      handleAuthChanges(me, setUser, setIsUserFetching);
    });

    return unsubAuthObserver;
  }, []);

  useEffect(() => {
    if (user) {
      const meQuery = query(collection(db, "users"), where("phone_no", "==", user.phone_no), limit(1));

      const unsubMeObserver = onSnapshot(meQuery, (doc) => {
        handleMeChanges(doc, user, allowedRoutes, setAllowedRoutes, navigate);
      });

      return unsubMeObserver;
    }
  }, [user]);

  if (isUserFetching) {
    return (
      <div>
        <button
          onClick={async () => {
            await signOut();
            setUser(null);
          }}
        >
          Sign out
        </button>
        <h1>Loading....</h1>;
      </div>
    );
  }

  const homepageMap = {
    passed: <h1>you passed {":)"}</h1>,
    failed: <h1>you failed {":)"}</h1>,
    skipped: <h1>you skipped your exam</h1>,
  };

  return (
    <AppContextProvider>
      <div>
        <button
          onClick={async () => {
            await signOut();
            setUser(null);
            window.location.href = ROUTE_LOGIN;
          }}
        >
          Sign out
        </button>
      </div>

      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path={ROUTE_LOGIN} element={<SignInPage />} />

          {user && <Route path={ROUTE_HOMEPAGE} element={user.status ? homepageMap[user.status] : <h1>countdown</h1>} />}

          <Route path={ROUTE_PROFILE} element={<CompleteProfilePage />} />

          <Route path={ROUTE_SLOTS} element={<AdmissionTestsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />

        <Route path={ROUTE_DEBUG} element={<DebugPage />} />
      </Routes>
    </AppContextProvider>
  );
};

App.defaultProps = {};

export default memo(App);
