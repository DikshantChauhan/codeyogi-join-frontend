import { FC, memo, ReactNode, useMemo, useState } from "react";
import { defaultAllowedRoutesContext, allowedRoutesContext } from "../Contexts/allowedRoutes.context";
import { isQuestionFetchableContext } from "../Contexts/isQuestionFetchable";
import { selectedExamContext } from "../Contexts/selectedExam.context";
import { userContext } from "../Contexts/user.contextt";
import { Exam } from "../Models/Exam";
import { User } from "../Models/User";

interface AppContextProps {
  children: ReactNode;
}

const AppContext: FC<AppContextProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const userValue = useMemo(() => ({ user, setUser }), [user]);

  const [allowedRoutes, setAllowedRoutes] = useState<string[]>(defaultAllowedRoutesContext.allowedRoutes);
  const allowedRoutesValue = useMemo(() => ({ allowedRoutes, setAllowedRoutes }), [allowedRoutes]);

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const selectedExamValue = useMemo(() => ({ selectedExam, setSelectedExam }), [selectedExam]);

  const [isQuestionFetchable, setIsQuestionFetchable] = useState(false);
  const isQuestionFetchableValue = useMemo(() => ({ isQuestionFetchable, setIsQuestionFetchable }), [isQuestionFetchable]);

  return (
    <userContext.Provider value={userValue}>
      <allowedRoutesContext.Provider value={allowedRoutesValue}>
        <selectedExamContext.Provider value={selectedExamValue}>
          <isQuestionFetchableContext.Provider value={isQuestionFetchableValue}>{children}</isQuestionFetchableContext.Provider>
        </selectedExamContext.Provider>
      </allowedRoutesContext.Provider>
    </userContext.Provider>
  );
};

export default memo(AppContext);
