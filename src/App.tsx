import { FC, memo, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTE_DEBUG, ROUTE_PROFILE, ROUTE_LOGIN, ROUTE_SLOTS, ROUTE_FORWARD_SLASH } from "./constants.routes";
import SignInPage from "./Pages/SignIn.Page";
import { authentication, db } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { userContext } from "./Contexts/user.Context";
import { User } from "./Models/User";
import CompleteProfilePage from "./Pages/CompleteProfile.Page";
import DebugPage from "./Pages/Debug.Page";
import { signOut } from "./APIs/auth.api";
import { handleAuthChanges, handleMeChanges, isStudentProfileComplete } from "./utils";
import NotFoundPage from "./Pages/NotFound.Page";
import AdmissionTestsPage from "./Pages/AdmissionTests.Page";
import { query, collection, where, limit, onSnapshot } from "firebase/firestore";

interface AppProps {}

const App: FC<AppProps> = () => {
  const [user, setUser] = useState<null | User>(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  const [isUserFetching, setIsUserFetching] = useState(true);

  useEffect(() => {
    const unsubAuthObserver = onAuthStateChanged(authentication, (me) => {
      handleAuthChanges(me, setUser, setIsUserFetching);
    });

    return unsubAuthObserver;
  }, []);

  useEffect(() => {
    if (user) {
      const meQuery = query(collection(db, "users"), where("phone_no", "==", user.phone_no), limit(1));
      const unsubMeObserver = onSnapshot(meQuery, handleMeChanges);

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

  const NavigateToDefault = <Navigate to={ROUTE_FORWARD_SLASH} />;
  return (
    <userContext.Provider value={value}>
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
        <Route
          path={ROUTE_FORWARD_SLASH}
          element={
            user ? (
              isStudentProfileComplete(user) ? (
                user.selected_exam_id !== null ? (
                  user.status ? (
                    homepageMap[user.status]
                  ) : (
                    <h1>countdown</h1>
                  )
                ) : (
                  <Navigate to={ROUTE_SLOTS} />
                )
              ) : (
                <Navigate to={ROUTE_PROFILE} />
              )
            ) : (
              <Navigate to={ROUTE_LOGIN} />
            )
          }
        />

        <Route path={ROUTE_LOGIN} element={user ? NavigateToDefault : <SignInPage />} />

        {user && (
          <>
            <Route path={ROUTE_PROFILE} element={isStudentProfileComplete(user) ? NavigateToDefault : <CompleteProfilePage />} />

            {isStudentProfileComplete(user) && (
              <Route path={ROUTE_SLOTS} element={user.selected_exam_id ? NavigateToDefault : <AdmissionTestsPage />} />
            )}
          </>
        )}

        <Route path={ROUTE_DEBUG} element={<DebugPage />} />

        <Route path="*" element={user ? <NotFoundPage /> : <Navigate to={ROUTE_FORWARD_SLASH}></Navigate>} />
      </Routes>
    </userContext.Provider>
  );
};

App.defaultProps = {};

export default memo(App);
