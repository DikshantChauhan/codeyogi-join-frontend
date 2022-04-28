import { createContext } from "react";
import { ROUTE_FORWARD_SLASH } from "../constants.routes";

export const defaultAllowedRoutesContext: {
  allowedRoutes: string[];
  setAllowedRoutes: (routes: string[]) => void;
} = {
  allowedRoutes: [ROUTE_FORWARD_SLASH],
  setAllowedRoutes: (routes: string[]) => {
    defaultAllowedRoutesContext.allowedRoutes = routes;
  },
};

export const allowedRoutesContext = createContext(defaultAllowedRoutesContext);
