import { createContext } from "react";

export const defaultIsQuestionFetchableContext: {
  isQuestionFetchable: boolean;
  setIsQuestionFetchable: (isFetchable: boolean) => void;
} = {
  isQuestionFetchable: true,
  setIsQuestionFetchable: (isFetchable: boolean) => {
    defaultIsQuestionFetchableContext.isQuestionFetchable = isFetchable;
  },
};

export const isQuestionFetchableContext = createContext(defaultIsQuestionFetchableContext);
