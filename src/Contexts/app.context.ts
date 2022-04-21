import { createContext } from "react";
import { User } from "../Models/User";
import { defaultAllowedRoutesContext } from "./allowedRoutes.context";
import { defaultUserContext } from "./user.contextt";

export const defaultAppContext: {
  userContext: {
    user: User | null;
    setUser: (user: User | null) => void;
  };
  allowedRoutesContext: {
    allowedRoutes: string[];
    setAllowedRoutes: (routes: string[]) => void;
  };
} = {
  userContext: defaultUserContext,
  allowedRoutesContext: defaultAllowedRoutesContext,
};

export const appContext = createContext(defaultAppContext);
