import { FC, memo, useContext, useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTE_DEBUG, ROUTE_PROFILE, ROUTE_LOGIN, ROUTE_SLOTS, ROUTE_HOMEPAGE, ROUTE_FORWARD_SLASH } from "./constants.routes";
import SignInPage from "./Pages/SignIn.Page";
import { authentication, db, functions } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import CompleteProfilePage from "./Pages/CompleteProfile.Page";
import DebugPage from "./Pages/Debug.Page";
import { signOut } from "./APIs/auth.api";
import { handleAuthChanges, handleMeChanges } from "./utils";
import AdmissionTestsPage from "./Pages/AdmissionTests.Page";
import { query, collection, where, limit, onSnapshot } from "firebase/firestore";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import NotFoundPage from "./Pages/NotFound.Page";
import { defaultUserContext, userContext } from "./Contexts/user.contextt";
import { allowedRoutesContext, defaultAllowedRoutesContext } from "./Contexts/allowedRoutes.context";
import Button from "./Components/Button";
import { httpsCallable } from "firebase/functions";
import { User } from "./Models/User";

interface AppProps {}

const App: FC<AppProps> = () => {
  const [user, setUser] = useState<User | null>(defaultUserContext.user);
  const userValue = useMemo(() => ({ user, setUser }), [user]);
  const [allowedRoutes, setAllowedRoutes] = useState<string[]>(defaultAllowedRoutesContext.allowedRoutes);
  const allowedRoutesValue = useMemo(() => ({ allowedRoutes, setAllowedRoutes }), [allowedRoutes]);
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

      const unsubMeObserver = onSnapshot(meQuery, (doc) => {
        handleMeChanges(doc, setUser, user, allowedRoutes, setAllowedRoutes);
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
    <userContext.Provider value={userValue}>
      <allowedRoutesContext.Provider value={allowedRoutesValue}>
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

          <Button
            onClick={async () => {
              const sayHello = httpsCallable(functions, "test");
              sayHello({ id: 1 })
                .then((result) => {
                  console.log(result.data);
                })
                .catch((error) => {
                  console.error(error);
                });
            }}
          >
            test
          </Button>
        </div>

        <Routes>
          <Route path={ROUTE_FORWARD_SLASH} element={<ProtectedRoutes />}>
            <Route path={ROUTE_LOGIN} element={<SignInPage />} />

            {user && <Route path={ROUTE_HOMEPAGE} element={user.status ? homepageMap[user.status] : <h1>countdown</h1>} />}

            <Route path={ROUTE_PROFILE} element={<CompleteProfilePage />} />

            <Route path={ROUTE_SLOTS} element={<AdmissionTestsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />

          <Route path={ROUTE_DEBUG} element={<DebugPage />} />
        </Routes>
      </allowedRoutesContext.Provider>
    </userContext.Provider>
  );
};

App.defaultProps = {};

export default memo(App);
