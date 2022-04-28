import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase-config";

export const scheduleTest = httpsCallable(functions, "schedule_test");
