import { User as FirebaseUser } from "@firebase/auth";
import { Unsubscribe, DocumentData, QuerySnapshot } from "firebase/firestore";
import { meFetchAPI } from "./APIs/auth.api";
import { ROUTE_PROFILE, ROUTE_SLOTS, ROUTE_FORWARD_SLASH, ROUTE_LOGIN } from "./constants.routes";
import { User } from "./Models/User";

const studentProfileFields = ["city_of_residence", "discovery_source", "email", "first_name", "last_name", "institute_name", "phone_no"];

export const isStudentProfileComplete = (user: User) => {
  return studentProfileFields.every((field) => !!user[field as keyof User]);
};

export const secondsToHHMMSS = (secs: number) => {
  var hours = Math.floor(secs / 3600);
  var minutes = Math.floor(secs / 60) % 60;
  var seconds = secs % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
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
      const user = await meFetchAPI(me.uid);

      setUser(user as any);
      setIsUserFetching(false);
    }, 1500);
  } else {
    setIsUserFetching(false);
  }
};

export const handleAllowedRoutes = (user: User | null, currentAllowedRoutes: string[], setAllowedRoutes: (routes: string[]) => void) => {
  const newAllowedRoutes = [];

  if (user === null) {
    newAllowedRoutes.push(ROUTE_LOGIN);
  } else if (!isStudentProfileComplete(user)) {
    newAllowedRoutes.push(ROUTE_PROFILE);
  } else if (!user.selected_exam_id) {
    newAllowedRoutes.push(ROUTE_SLOTS);
  } else if (user.status === "skipped") {
    newAllowedRoutes.push(ROUTE_FORWARD_SLASH);
    newAllowedRoutes.push(ROUTE_SLOTS);
  } else if (user.status) {
    newAllowedRoutes.push(ROUTE_FORWARD_SLASH);
  }

  const check = newAllowedRoutes.sort().toString() === currentAllowedRoutes.sort().toString();

  if (!check) {
    setAllowedRoutes(newAllowedRoutes);
  }
};

export const handleMeChanges = (
  doc: QuerySnapshot<DocumentData>,
  user: User | null,
  currentAllowedRoutes: string[],
  setAllowedRoutes: (routes: string[]) => void
) => {
  doc.docChanges().forEach((change) => {
    if (change.type === "modified") {
      console.log("Modified ", change.doc.data());
    }
  });

  handleAllowedRoutes(user, currentAllowedRoutes, setAllowedRoutes);
};
