import { Entity } from "./Entity";

export interface AdmissionTestEntity extends Entity {
  name: string;
  start_date: string;
  duration: number;
  instructions: string;
  question_count: number;
}
