import { createContext } from "react";
import { ROUTE_LOGIN } from "../constants.routes";

export const defaultAllowedRoutesContext: {
  allowedRoutes: string[];
  setAllowedRoutes: (routes: string[]) => void;
} = {
  allowedRoutes: [ROUTE_LOGIN],
  setAllowedRoutes: (routes: string[]) => {
    defaultAllowedRoutesContext.allowedRoutes = routes;
  },
};

export const allowedRoutesContext = createContext(defaultAllowedRoutesContext);
