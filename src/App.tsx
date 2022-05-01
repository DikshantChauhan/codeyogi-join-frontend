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
import { authentication } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import CompleteProfilePage from "./Pages/CompleteProfile.Page";
import DebugPage from "./Pages/Debug.Page";
import { getMeDocRef, handleAuthChanges, handleMeChanges, isExamOver } from "./utils";
import { onSnapshot } from "firebase/firestore";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import { defaultUserContext, userContext } from "./Contexts/user.contextt";
import { allowedRoutesContext, defaultAllowedRoutesContext } from "./Contexts/allowedRoutes.context";
import { User } from "./Models/User";
import SlotsPage from "./Pages/Slots.Page";
import ExamInstructionsPage from "./Pages/ExamInstructions.Page";
import MainExamPage from "./Pages/MainExamPage";
import AppContainer from "./Components/AppContainer";
import HomePage from "./Pages/Home.Page";
import { selectedExamContext } from "./Contexts/selectedExam.context";
import { Exam } from "./Models/Exam";
import { fetchExamQuestionAPI, fetchSelectedExamAPI } from "./APIs/exam.api";
import { isQuestionFetchableContext } from "./Contexts/isQuestionFetchable";

export let userEnteredRoute = ROUTE_FORWARD_SLASH;
export const setUserEnteredRoute = (route: string) => {
  userEnteredRoute = route;
};
window.onload = () => {
  setUserEnteredRoute(location.pathname);
};

interface AppProps {}

const App: FC<AppProps> = () => {
  const [user, setUser] = useState<User | null>(null);
  const userValue = useMemo(() => ({ user, setUser }), [user]);

  const [allowedRoutes, setAllowedRoutes] = useState<string[]>(defaultAllowedRoutesContext.allowedRoutes);
  const allowedRoutesValue = useMemo(() => ({ allowedRoutes, setAllowedRoutes }), [allowedRoutes]);

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const selectedExamValue = useMemo(() => ({ selectedExam, setSelectedExam }), [selectedExam]);

  const [isQuestionFetchable, setIsQuestionFetchable] = useState(false);
  const isQuestionFetchableValue = useMemo(() => ({ isQuestionFetchable, setIsQuestionFetchable }), [isQuestionFetchable]);

  const [isUserFetching, setIsUserFetching] = useState(true);
  const [isSelectedExamFetching, setIsSelectedExamFetching] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubAuthObserver = onAuthStateChanged(authentication, async (me) => {
      await handleAuthChanges(me, setUser, setIsUserFetching);
      const exam = await fetchSelectedExamAPI();

      setSelectedExam(exam || null);
      setIsSelectedExamFetching(false);
    });

    return unsubAuthObserver;
  }, []);

  useEffect(() => {
    const meDocRef = getMeDocRef();

    if (!meDocRef) return;

    const unsubMeObserver = onSnapshot(meDocRef, async (doc) => {
      await handleMeChanges(
        doc,
        setUser,
        allowedRoutes,
        selectedExam,
        setAllowedRoutes,
        navigate,
        setSelectedExam,
        setIsSelectedExamFetching,
        isQuestionFetchable,
        user
      );
    });

    return unsubMeObserver;
  }, [user]);

  //Check if Question is Fetchable
  useEffect(() => {
    if (!selectedExam) {
      setIsQuestionFetchable(false);
      return;
    }
    if (isExamOver(selectedExam)) {
      setIsQuestionFetchable(false);
      return;
    }
    fetchExamQuestionAPI(selectedExam)
      .then((response) => {
        response && setIsQuestionFetchable(true);
      })
      .catch(() => {
        setIsQuestionFetchable(false);
      });
  }, [selectedExam]);

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
          <isQuestionFetchableContext.Provider value={isQuestionFetchableValue}>
            <Routes>
              <Route path={ROUTE_FORWARD_SLASH} element={<ProtectedRoutes />}>
                <Route path={ROUTE_LOGIN} element={<SignInPage />} />

                <Route path={ROUTE_EXAM} element={<MainExamPage />} />

                <Route element={<AppContainer />}>
                  <Route path={ROUTE_HOMEPAGE} element={<HomePage />} />

                  <Route path={ROUTE_PROFILE} element={<CompleteProfilePage />} />

                  <Route path={ROUTE_SLOTS} element={<SlotsPage />} />

                  <Route path={ROUTE_EXAM_INSTRUCTIONS} element={<ExamInstructionsPage />} />
                </Route>
              </Route>

              <Route path={ROUTE_DEBUG} element={<DebugPage />} />

              <Route path="*" element={<Navigate to={ROUTE_FORWARD_SLASH} />} />
            </Routes>
          </isQuestionFetchableContext.Provider>
        </selectedExamContext.Provider>
      </allowedRoutesContext.Provider>
    </userContext.Provider>
  );
};

App.defaultProps = {};

export default memo(App);
