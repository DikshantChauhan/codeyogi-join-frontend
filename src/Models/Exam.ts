export interface Exam {
  start_at: { seconds: number; nanoseconds: number };
  status: "draft" | "completed" | "published";
  external_id: number;
}
