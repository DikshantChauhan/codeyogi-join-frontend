import { User as FirebaseUser } from "@firebase/auth";
import { addHours, isPast } from "date-fns";
import { addMinutes, subMinutes } from "date-fns/esm";
import { Unsubscribe, DocumentData, QuerySnapshot, doc } from "firebase/firestore";
import { NavigateFunction } from "react-router-dom";
import { authentication, db } from "../firebase-config";
import { meFetchAPI } from "./APIs/auth.api";
import { EXAM_DURATION_IN_MINS, EXAM_INSTRUCTION_DURATION_IN_MINS } from "./APIs/base";
import {
  ROUTE_PROFILE,
  ROUTE_SLOTS,
  ROUTE_FORWARD_SLASH,
  ROUTE_LOGIN,
  ROUTE_HOMEPAGE,
  ROUTE_EXAM_INSTRUCTIONS,
  ROUTE_EXAM,
} from "./constants.routes";
import { Exam } from "./Models/Exam";
import { User } from "./Models/User";

const studentProfileFields = ["city_of_residence", "discovery_source", "email", "first_name", "last_name", "institute_name", "phone_no"];

export const isStudentProfileComplete = (user: User | null) => {
  if (!user) return false;
  return studentProfileFields.every((field) => !!user[field as keyof User]);
};

export const secondsToHHMMSS = (seconds: number) => {
  let hours: number | string = Math.floor(seconds / 3600);
  let minutes: number | string = Math.floor((seconds - hours * 3600) / 60);
  seconds = seconds - hours * 3600 - minutes * 60;
  let secondsString = seconds.toString();

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    secondsString = "0" + seconds;
  }

  let time = hours + ":" + minutes + ":" + secondsString;

  return time;
};

export const isExamInstructionTimeStarted = (exam: Exam) => {
  const examStartedAt = new Date(exam.start_at.seconds * 1000);
  const examPreprationStartAt = subMinutes(examStartedAt, EXAM_INSTRUCTION_DURATION_IN_MINS);

  if (isPast(examPreprationStartAt)) {
    return true;
  } else {
    return false;
  }
};

export const isExamStarted = (exam: Exam) => {
  const examStartedAt = new Date(exam.start_at.seconds * 1000);

  if (isPast(examStartedAt)) {
    return true;
  } else {
    return false;
  }
};

export const isExamOver = (exam: Exam) => {
  const examStartedAt = new Date(exam.start_at.seconds * 1000);
  const examEndAt = addMinutes(examStartedAt, EXAM_DURATION_IN_MINS);

  if (isPast(examEndAt)) {
    return true;
  } else {
    return false;
  }
};

export const getExamInstructionTime = (exam: Exam) => {
  const examStartedAt = new Date(exam.start_at.seconds * 1000);
  const examEndAt = addMinutes(examStartedAt, EXAM_DURATION_IN_MINS);

  if (isPast(examEndAt)) {
    return true;
  } else {
    return false;
  }
};

export let unsubMeObserver: Unsubscribe | undefined;

export const handleAuthChanges = async (
  me: FirebaseUser | null,
  setUser: (user: User | null) => void,
  setIsUserFetching: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (me) {
    setIsUserFetching(true);

    setTimeout(async () => {
      const user = await meFetchAPI();

      setUser(user as any);
      setIsUserFetching(false);
    }, 1500);
  } else {
    setIsUserFetching(false);
  }
};

export const handleAllowedRoutes = (
  user: User | null,
  currentAllowedRoutes: string[],
  selectedExam: Exam | null,
  setAllowedRoutes: (routes: string[]) => void,
  navigate: NavigateFunction
) => {
  const newAllowedRoutes = [];
  const currentRoute = window.location.pathname;

  if (!user) {
    newAllowedRoutes.push(ROUTE_LOGIN);
  } else {
    if (isStudentProfileComplete(user)) {
      if (!user.selected_exam_id) {
        newAllowedRoutes.push(ROUTE_SLOTS);
      } else {
        if (selectedExam) {
          if (user.status) {
            newAllowedRoutes.push(ROUTE_HOMEPAGE);
          } else {
            if (!isExamInstructionTimeStarted(selectedExam) && !isExamOver(selectedExam)) {
              newAllowedRoutes.push(ROUTE_HOMEPAGE);
            }
          }

          if (user.status === "skipped") {
            newAllowedRoutes.push(ROUTE_SLOTS);
          } else if (!user.exam_started_at && !isExamOver(selectedExam)) {
            newAllowedRoutes.push(ROUTE_EXAM_INSTRUCTIONS);
          } else if (user.exam_started_at && !isExamOver(selectedExam)) {
            newAllowedRoutes.push(ROUTE_EXAM);
          }
        }
      }
    }
    newAllowedRoutes.push(ROUTE_PROFILE);
  }

  const check = [...newAllowedRoutes].sort().toString() === [...currentAllowedRoutes].sort().toString();

  if (!check) {
    setAllowedRoutes(newAllowedRoutes);

    if (currentRoute === ROUTE_FORWARD_SLASH) navigate(newAllowedRoutes[0]);
    if (currentRoute === ROUTE_LOGIN && user) navigate(newAllowedRoutes[0]);
    if (!!!newAllowedRoutes.find((route) => route === currentRoute)) navigate(newAllowedRoutes[0]);
  }
};

export const handleMeChanges = (
  doc: QuerySnapshot<DocumentData>,
  setUser: (user: User | null) => void,
  currentAllowedRoutes: string[],
  selectedExam: Exam | null,
  setAllowedRoutes: (routes: string[]) => void,
  navigate: NavigateFunction
) => {
  setTimeout(() => {
    let changedUser: User | null = null;

    doc.docChanges().forEach((change) => {
      if (change.type === "modified") {
        changedUser = change.doc.data() as User | null;
        setUser(changedUser as User);
      }
    });

    if (changedUser) {
      handleAllowedRoutes(changedUser, currentAllowedRoutes, selectedExam, setAllowedRoutes, navigate);
    }
  }, 1500);
};

export const getMeDocRef = () => {
  const currentUser = authentication.currentUser;
  if (!currentUser) return;

  const meDocRef = doc(db, "users", currentUser.uid);

  return meDocRef;
};
