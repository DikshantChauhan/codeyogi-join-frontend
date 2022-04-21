import { FC, memo, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTE_DEBUG, ROUTE_PROFILE, ROUTE_LOGIN, ROUTE_SLOTS, ROUTE_FORWARD_SLASH } from "./constants.routes";
import SignInPage from "./Pages/SignIn.Page";
import { authentication } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { userContext } from "./Contexts/user.Context";
import { User } from "./Models/User";
import CompleteProfilePage from "./Pages/CompleteProfile.Page";
import DebugPage from "./Pages/Debug.Page";
import { meFetchAPI, signOut } from "./APIs/auth.api";
import { isStudentProfileComplete } from "./utils";
import NotFoundPage from "./Pages/NotFound.Page";
import AdmissionTestsPage from "./Pages/AdmissionTests.Page";

interface AppProps {}

const App: FC<AppProps> = () => {
  const [user, setUser] = useState<null | User>(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  const [isUserFetching, setIsUserFetching] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(authentication, async (me) => {
      if (me) {
        setIsUserFetching(true);

        setTimeout(async () => {
          const user = await meFetchAPI(me.uid);

          setUser(user as any);
          setIsUserFetching(false);
        }, 1500);
      } else {
        setIsUserFetching(false);
      }
    });

    return unsub;
  }, []);

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
                user.selected_exam_id !== undefined ? (
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

        <Route path={ROUTE_LOGIN} element={user ? <Navigate to={ROUTE_FORWARD_SLASH} /> : <SignInPage />} />

        {user && (
          <>
            <Route path={ROUTE_PROFILE} element={isStudentProfileComplete(user) ? <Navigate to={ROUTE_FORWARD_SLASH} /> : <CompleteProfilePage />} />

            <Route path={ROUTE_SLOTS} element={user.selected_exam_id ? <Navigate to={ROUTE_FORWARD_SLASH} /> : <AdmissionTestsPage />} />
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
