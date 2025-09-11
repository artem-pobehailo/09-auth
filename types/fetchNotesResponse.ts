import { Note } from "./note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  perPage?: number;
}
