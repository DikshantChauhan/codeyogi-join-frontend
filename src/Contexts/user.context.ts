import { createContext } from "react";
import { User } from "../Models/User";

export const defaultUserContext: {
  user: null | User;
  setUser: (user: User | null) => void;
} = {
  user: null,
  setUser: (user: User | null) => {
    defaultUserContext.user = user;
  },
};

export const userContext = createContext(defaultUserContext);
