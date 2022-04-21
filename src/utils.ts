import { User as FirebaseUser } from "@firebase/auth";
import { onSnapshot, Unsubscribe, DocumentData, collection, query, where, QuerySnapshot, limit } from "firebase/firestore";
import { db } from "../firebase-config";
import { meFetchAPI } from "./APIs/auth.api";
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
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
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

export const handleMeChanges = (doc: QuerySnapshot<DocumentData>) => {
  doc.docChanges().forEach((change) => {
    if (change.type === "modified") {
      console.log("Modified ", change.doc.data());
    }
  });
};
