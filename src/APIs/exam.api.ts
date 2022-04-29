import { collection, serverTimestamp, getDoc, getDocs, limit, orderBy, query, setDoc, where } from "firebase/firestore";
import { authentication, db } from "../../firebase-config";
import { Exam } from "../Models/Exam";
import { StudentAnswerOptions, StudentQuestion } from "../Models/StudentQuestion";
import { User } from "../Models/User";
import { getMeDocRef, isStudentProfileComplete } from "../utils";
import { meUpdateAPI } from "./auth.api";

export const fetchSelectedExamAPI = async () => {
  const meDocRef = getMeDocRef();

  if (!meDocRef) return;

  const meData = (await getDoc(meDocRef)).data() as User | null;

  if (!(meData && isStudentProfileComplete(meData))) return;

  const examDocsQuery = query(collection(db, "exams"), where("external_id", "==", meData.selected_exam_id!), limit(1));
  const examDocs = await getDocs(examDocsQuery);

  if (examDocs.empty) return;

  const selectedExam = examDocs.docs[0].data() as Exam;

  return selectedExam;
};

export const fetchExamListAPI = async () => {
  const examDocsQuery = query(collection(db, "exams"), where("status", "==", "published"));
  const examDocs = await getDocs(examDocsQuery);

  if (examDocs.empty) return;

  const examList = examDocs.docs.map((examDoc) => examDoc.data() as Exam);

  return examList;
};

export const fetchExamQuestionAPI = async () => {
  if (!authentication.currentUser) return;

  const usersQuestionsCollectionref = collection(db, "users", authentication.currentUser.uid, "questions");
  const questionQuery = query(usersQuestionsCollectionref, where("answer", "==", null), limit(1), orderBy("id"));
  const questionSnapShort = await getDocs(questionQuery);

  if (questionSnapShort.empty) return;

  const question = questionSnapShort.docs[0].data() as any;

  return question as StudentQuestion;
};

export const submitExamQuestionAPI = async (answer: StudentAnswerOptions) => {
  if (!authentication.currentUser) return;

  const usersQuestionsCollectionref = collection(db, "users", authentication.currentUser.uid, "questions");
  const questionQuery = query(usersQuestionsCollectionref, where("answer", "==", null), limit(1));
  const questionSnapShort = await getDocs(questionQuery);
  const questionRef = questionSnapShort.docs[0].ref;

  await setDoc(questionRef, { answer }, { merge: true });
};

export const startExamAPI = async () => {
  await meUpdateAPI({ exam_started_at: serverTimestamp() } as any);
};
