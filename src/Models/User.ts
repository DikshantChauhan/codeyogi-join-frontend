export interface User {
  city_of_residence?: string;
  discovery_source?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  institute_name?: string;
  phone_no: string | number;
  selected_exam_id?: number;
  status?: "passed" | "failed" | "skipped";
  exam_started_at?: string;
}
