import { FC, memo, useEffect, useMemo, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
  ROUTE_DEBUG,
  ROUTE_PROFILE,
  ROUTE_LOGIN,
  ROUTE_SLOTS,
  ROUTE_HOMEPAGE,
  ROUTE_FORWARD_SLASH,
  ROUTE_EXAM_INSTRUCTIONS,
  ROUTE_EXAM,
} from "./constants.routes";
import SignInPage from "./Pages/SignIn.Page";
import { authentication, db } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import CompleteProfilePage from "./Pages/CompleteProfile.Page";
import DebugPage from "./Pages/Debug.Page";
import { handleAuthChanges, handleMeChanges } from "./utils";
import { query, collection, where, limit, onSnapshot } from "firebase/firestore";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import NotFoundPage from "./Pages/NotFound.Page";
import { defaultUserContext, userContext } from "./Contexts/user.contextt";
import { allowedRoutesContext, defaultAllowedRoutesContext } from "./Contexts/allowedRoutes.context";
import { User } from "./Models/User";
import CountdownPage from "./Pages/Countdown.Page";
import ExamsPage from "./Pages/Exams.Page";
import ExamInstructionsPage from "./Pages/ExamInstructions.Page";
import MainExamPage from "./Pages/MainExamPage";
import { test } from "./APIs/cloudFunctions.api";

interface AppProps {}

const App: FC<AppProps> = () => {
  const [user, setUser] = useState<User | null>(defaultUserContext.user);
  const userValue = useMemo(() => ({ user, setUser }), [user]);
  const [allowedRoutes, setAllowedRoutes] = useState<string[]>(defaultAllowedRoutesContext.allowedRoutes);
  const allowedRoutesValue = useMemo(() => ({ allowedRoutes, setAllowedRoutes }), [allowedRoutes]);
  const [isUserFetching, setIsUserFetching] = useState(true);
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
        handleMeChanges(doc, setUser, allowedRoutes, setAllowedRoutes, navigate);
      });

      return unsubMeObserver;
    }
  }, [user]);

  if (isUserFetching) {
    return (
      <div>
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
    <userContext.Provider value={userValue}>
      <allowedRoutesContext.Provider value={allowedRoutesValue}>
        <Routes>
          <Route path={ROUTE_FORWARD_SLASH} element={<ProtectedRoutes />}>
            <Route path={ROUTE_LOGIN} element={<SignInPage />} />

            {user && <Route path={ROUTE_HOMEPAGE} element={user.status ? homepageMap[user.status] : <CountdownPage />} />}

            <Route path={ROUTE_PROFILE} element={<CompleteProfilePage />} />

            <Route path={ROUTE_SLOTS} element={<ExamsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />

          <Route path={ROUTE_DEBUG} element={<DebugPage />} />
          <Route path={ROUTE_EXAM_INSTRUCTIONS} element={<ExamInstructionsPage />} />
          <Route path={ROUTE_EXAM} element={<MainExamPage />} />
        </Routes>
      </allowedRoutesContext.Provider>
    </userContext.Provider>
  );
};

App.defaultProps = {};

export default memo(App);
