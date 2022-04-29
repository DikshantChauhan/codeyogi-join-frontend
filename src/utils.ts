import { User as FirebaseUser } from "@firebase/auth";
import { isPast } from "date-fns";
import { addMinutes, subMinutes } from "date-fns/esm";
import { RecaptchaVerifier } from "firebase/auth";
import { Unsubscribe, DocumentData, doc, DocumentSnapshot } from "firebase/firestore";
import { NavigateFunction } from "react-router-dom";
import { authentication, db } from "../firebase-config";
import { meFetchAPI } from "./APIs/auth.api";
import { EXAM_DURATION_IN_MINS, EXAM_INSTRUCTION_DURATION_IN_MINS } from "./APIs/base";
import { fetchSelectedExamAPI } from "./APIs/exam.api";
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

export const getExamStartAt = (exam: Exam) => {
  const examStartedAt = new Date(exam.start_at.seconds * 1000);
  return examStartedAt;
};

export const hasExamInstructionTimeStarted = (exam: Exam) => {
  const examStartedAt = getExamStartAt(exam);
  const examPreprationStartAt = subMinutes(examStartedAt, EXAM_INSTRUCTION_DURATION_IN_MINS);

  if (isPast(examPreprationStartAt)) {
    return true;
  } else {
    return false;
  }
};

export const hasExamStarted = (exam: Exam) => {
  const examStartedAt = getExamStartAt(exam);

  if (isPast(examStartedAt)) {
    return true;
  } else {
    return false;
  }
};

export const isExamOver = (exam: Exam) => {
  const examStartedAt = getExamStartAt(exam);
  const examEndAt = addMinutes(examStartedAt, EXAM_DURATION_IN_MINS);

  if (isPast(examEndAt)) {
    return true;
  } else {
    return false;
  }
};

export const getExamInstructionTimeStartedAt = (exam: Exam) => {
  const examInstructionTimeStartedAt = subMinutes(getExamStartAt(exam), EXAM_INSTRUCTION_DURATION_IN_MINS);
  return examInstructionTimeStartedAt;
};

export const hasStudentFinishedExamEarly = (isQuestionFetchable: boolean, exam: Exam) => {
  if (!isExamOver(exam) && isQuestionFetchable) {
    return true;
  }
  return false;
};

export const getResultTime = (exam: Exam) => {
  const resultTime = addMinutes(getExamStartAt(exam), EXAM_DURATION_IN_MINS + 10);
  return resultTime;
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
  navigate: NavigateFunction,
  isQuestionFetchable: boolean
) => {
  const newAllowedRoutes: string[] = [];
  const currentRoute = window.location.pathname;

  // // "/login";
  // !user && newAllowedRoutes.push(ROUTE_LOGIN);

  // // "/exam";
  // user && user.exam_started_at && selectedExam && !isExamOver(selectedExam) && newAllowedRoutes.push(ROUTE_EXAM);

  // // "/exam/instructions";
  // user &&
  //   isStudentProfileComplete(user) &&
  //   user.selected_exam_id &&
  //   selectedExam &&
  //   isExamInstructionTimeStarted(selectedExam) &&
  //   !isExamOver(selectedExam) &&
  //   !user.exam_started_at &&
  //   newAllowedRoutes.push(ROUTE_EXAM_INSTRUCTIONS);

  // // "/home"
  // user &&
  //   isStudentProfileComplete(user) &&
  //   user.selected_exam_id &&
  //   (user.status ||
  //     (selectedExam &&
  //       (!isExamInstructionTimeStarted(selectedExam) ||
  //         isExamOver(selectedExam) ||
  //         isStudentFinishedExamEarly(isQuestionFetchable, selectedExam)))) &&
  //   newAllowedRoutes.push(ROUTE_HOMEPAGE);

  // // "/slots";
  // user && isStudentProfileComplete(user) && (!user.selected_exam_id || user.status === "skipped") && newAllowedRoutes.push(ROUTE_SLOTS);

  // // "/profile";
  // user && newAllowedRoutes.push(ROUTE_PROFILE);

  if (!user) {
    newAllowedRoutes.push(ROUTE_LOGIN);
  } else if (!isStudentProfileComplete(user)) {
    newAllowedRoutes.push(ROUTE_PROFILE);
  } else if (!user.selected_exam_id) {
    newAllowedRoutes.push(ROUTE_SLOTS);
  } else if (user.status === "skipped") {
    newAllowedRoutes.push(ROUTE_HOMEPAGE);
    newAllowedRoutes.push(ROUTE_SLOTS);
  } else if (user.status) {
    newAllowedRoutes.push(ROUTE_HOMEPAGE);
  } else if (selectedExam) {
    if (!hasExamInstructionTimeStarted(selectedExam)) {
      newAllowedRoutes.push(ROUTE_HOMEPAGE);
    } else if (!user.exam_started_at && !isExamOver(selectedExam)) {
      newAllowedRoutes.push(ROUTE_EXAM_INSTRUCTIONS);
    } else {
      newAllowedRoutes.push(ROUTE_EXAM);
    }
  }

  if (!newAllowedRoutes.find((route) => route === ROUTE_PROFILE) && user) {
    newAllowedRoutes.push(ROUTE_PROFILE);
  }

  const check = [...newAllowedRoutes].sort().toString() === [...currentAllowedRoutes].sort().toString();

  if (!check) {
    setAllowedRoutes(newAllowedRoutes);

    if (currentRoute === ROUTE_FORWARD_SLASH) navigate(newAllowedRoutes[0]);
    if (currentRoute === ROUTE_LOGIN && user) navigate(newAllowedRoutes[0]);
    if (!newAllowedRoutes.find((route) => route === currentRoute)) navigate(newAllowedRoutes[0]);
  }
};

export const handleMeChanges = async (
  doc: DocumentSnapshot<DocumentData>,
  setUser: (user: User | null) => void,
  currentAllowedRoutes: string[],
  selectedExam: Exam | null,
  setAllowedRoutes: (routes: string[]) => void,
  navigate: NavigateFunction,
  setSelectedExam: (user: Exam | null) => void,
  setIsSelectedExamFetching: (isLoadin: boolean) => void,
  isQuestionFetchable: boolean
) => {
  let changedUser: User | null = null;
  let exam: Exam | null = null;

  if (!doc.metadata.hasPendingWrites) {
    changedUser = doc.data() as User | null;
    exam = (await fetchSelectedExamAPI()) || null;

    setSelectedExam(exam);
    setIsSelectedExamFetching(false);
    setUser(changedUser as User);
  }

  if (changedUser) {
    handleAllowedRoutes(changedUser, currentAllowedRoutes, selectedExam, setAllowedRoutes, navigate, isQuestionFetchable);
  }
};

export const getMeDocRef = () => {
  const currentUser = authentication.currentUser;
  if (!currentUser) return;

  const meDocRef = doc(db, "users", currentUser.uid);

  return meDocRef;
};

export const HHMMSSToSeconds = (time: string) => {
  const chunks = time.split(":").map((ch) => +ch);

  if (chunks.length !== 3) {
    throw "Format should be HH:MM:SS";
  } else if (chunks.some((el) => Number.isNaN(el))) {
    throw "Each section should be a number";
  }

  const timeInSeconds = chunks[0] * 60 * 60 + chunks[1] * 60 + chunks[2];

  return timeInSeconds;
};

export const generateRecaptcha = (containerOrId: string | HTMLElement, success?: (response: any) => void) => {
  return new RecaptchaVerifier(
    containerOrId,
    {
      size: "invisible",
      callback: (response: any) => {
        success && success(response);
      },
    },
    authentication
  );
};
