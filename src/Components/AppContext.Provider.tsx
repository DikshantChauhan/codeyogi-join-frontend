import { FC, memo, useMemo, useState } from "react";
import { allowedRoutesContext, defaultAllowedRoutesContext } from "../Contexts/allowedRoutes.context";
import { defaultUserContext, userContext } from "../Contexts/user.contextt";
import { User } from "../Models/User";

interface AppContextProps {
  children: any | any[];
}

const AppContext: FC<AppContextProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultUserContext.user);
  const userValue = useMemo(() => ({ user, setUser }), [user]);
  const [allowedRoutes, setAllowedRoutes] = useState<string[]>(defaultAllowedRoutesContext.allowedRoutes);
  const allowedRoutesValue = useMemo(() => ({ allowedRoutes, setAllowedRoutes }), [allowedRoutes]);

  return (
    <userContext.Provider value={userValue}>
      <allowedRoutesContext.Provider value={allowedRoutesValue}>{children}</allowedRoutesContext.Provider>
    </userContext.Provider>
  );
};

export default memo(AppContext);
