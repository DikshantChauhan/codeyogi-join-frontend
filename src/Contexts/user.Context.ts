import { createContext } from "react";
import { User } from "../Models/User";

const defaultUserContext: {
  user: null | User;
  setUser: (user: User) => void;
} = {
  user: null,
  setUser: (user: User) => {
    defaultUserContext.user = user;
  },
};

export const userContext = createContext(defaultUserContext);
