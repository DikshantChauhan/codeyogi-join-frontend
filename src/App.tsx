import { FC, memo, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTE_DEBUG, ROUTE_PROFILE, ROUTE_SIGN_IN, ROUTE_TESTS } from "./constants.routes";
import SignInPage from "./Pages/SignIn.Page";
import { authentication, db } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { userContext } from "./Contexts/user.Context";
import { User } from "./Models/User";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import CompleteProfilePage from "./Pages/CompleteProfile.Page";
import DebugPage from "./Pages/Debug.Page";

interface AppProps {}

const App: FC<AppProps> = () => {
  const [user, setUser] = useState<null | User>(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  const [isUserFetching, setIsUserFetching] = useState(true);

  useEffect(() => {
    onAuthStateChanged(authentication, async (me) => {
      if (me) {
        const q = query(collection(db, "users"), where("uid", "==", me.uid), limit(1));

        const docs = await getDocs(q);
        docs.forEach((doc) => {
          setUser(doc.data() as User);
          !user && setIsUserFetching(false);
        });
      } else {
      }
    });
  }, []);
  console.log(user);

  if (isUserFetching) {
    return <h1>Loading....</h1>;
  }

  return (
    <userContext.Provider value={value}>
      <Routes>
        {user && (
          <>
            <Route path={ROUTE_PROFILE} element={true ? <Navigate to={ROUTE_TESTS}></Navigate> : <CompleteProfilePage />} />
            <Route path={ROUTE_TESTS} element={<h1>Tests page</h1>} />
          </>
        )}
        {!user && (
          <>
            <Route path={ROUTE_SIGN_IN} element={<SignInPage />} />
          </>
        )}

        <Route path={ROUTE_DEBUG} element={<DebugPage />} />

        <Route path="*" element={<Navigate to={user ? ROUTE_PROFILE : ROUTE_SIGN_IN}></Navigate>}></Route>
      </Routes>
    </userContext.Provider>
  );
};

App.defaultProps = {};

export default memo(App);
