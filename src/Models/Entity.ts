import { DateTime } from "luxon";

export interface Entity {
  id: number;
  created_at: string;
  updated_at?: string;
}
