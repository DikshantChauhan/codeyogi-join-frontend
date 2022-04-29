import { FC, memo, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
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
import { getMeDocRef, handleAuthChanges, handleMeChanges } from "./utils";
import { query, collection, where, limit, onSnapshot, getDoc } from "firebase/firestore";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import { defaultUserContext, userContext } from "./Contexts/user.contextt";
import { allowedRoutesContext, defaultAllowedRoutesContext } from "./Contexts/allowedRoutes.context";
import { User } from "./Models/User";
import ExamsPage from "./Pages/Exams.Page";
import ExamInstructionsPage from "./Pages/ExamInstructions.Page";
import MainExamPage from "./Pages/MainExamPage";
import AppContainer from "./Components/AppContainer";
import HomePage from "./Pages/Home.Page";
import { selectedExamContext } from "./Contexts/selectedExam.context";
import { Exam } from "./Models/Exam";
import { fetchSelectedExam } from "./APIs/exam.api";

interface AppProps {}

const App: FC<AppProps> = () => {
  const [user, setUser] = useState<User | null>(defaultUserContext.user);
  const userValue = useMemo(() => ({ user, setUser }), [user]);

  const [allowedRoutes, setAllowedRoutes] = useState<string[]>(defaultAllowedRoutesContext.allowedRoutes);
  const allowedRoutesValue = useMemo(() => ({ allowedRoutes, setAllowedRoutes }), [allowedRoutes]);

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const selectedExamValue = useMemo(() => ({ selectedExam, setSelectedExam }), [selectedExam]);

  const [isUserFetching, setIsUserFetching] = useState(true);
  const [isSelectedExamFetching, setIsSelectedExamFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubAuthObserver = onAuthStateChanged(authentication, (me) => {
      handleAuthChanges(me, setUser, setIsUserFetching);
    });

    return unsubAuthObserver;
  }, []);

  useEffect(() => {
    if (user) {
      const meDocRef = getMeDocRef();

      if (!meDocRef) return;

      const unsubMeObserver = onSnapshot(meDocRef, (doc) => {
        handleMeChanges(doc, setUser, allowedRoutes, selectedExam, setAllowedRoutes, navigate);
      });

      return unsubMeObserver;
    }
  }, [user]);

  useEffect(() => {
    if (user?.selected_exam_id) {
      fetchSelectedExam().then((selectedExam) => {
        if (selectedExam) {
          setSelectedExam(selectedExam);
        }
      });
    }
    setIsSelectedExamFetching(false);
  }, [user]);

  if (isUserFetching || isSelectedExamFetching) {
    return (
      <div>
        <h1>Loading....</h1>;
      </div>
    );
  }

  return (
    <userContext.Provider value={userValue}>
      <allowedRoutesContext.Provider value={allowedRoutesValue}>
        <selectedExamContext.Provider value={selectedExamValue}>
          <Routes>
            <Route path={ROUTE_FORWARD_SLASH} element={<ProtectedRoutes />}>
              <Route path={ROUTE_LOGIN} element={<SignInPage />} />

              <Route element={<AppContainer />}>
                <Route path={ROUTE_HOMEPAGE} element={<HomePage />} />

                <Route path={ROUTE_PROFILE} element={<CompleteProfilePage />} />

                <Route path={ROUTE_SLOTS} element={<ExamsPage />} />

                <Route path={ROUTE_EXAM_INSTRUCTIONS} element={<ExamInstructionsPage />} />

                <Route path={ROUTE_EXAM} element={<MainExamPage />} />
              </Route>
            </Route>

            <Route path={ROUTE_DEBUG} element={<DebugPage />} />

            <Route path="*" element={<Navigate to={ROUTE_FORWARD_SLASH} />} />
          </Routes>
        </selectedExamContext.Provider>
      </allowedRoutesContext.Provider>
    </userContext.Provider>
  );
};

App.defaultProps = {};

export default memo(App);
