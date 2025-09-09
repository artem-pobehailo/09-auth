// lib/api.ts

import { NewNoteData, Note } from "@/types/note";
import axios from "axios";
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  perPage?: number;
}

const BASE_URL = "https://notehub-public.goit.study/api";
const token = process.env.NEXT_PUBLIC_API_TOKEN;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export const fetchNotes = async (
  search?: string,
  page = 1,
  perPage?: number,
  tag?: string
): Promise<FetchNotesResponse> => {
  try {
    const params: Record<string, string | number> = { page };
    if (perPage) params.perPage = perPage;
    if (search && search.trim() !== "") {
      params.search = search;
    }
    if (tag && tag !== "all") {
      params.tag = tag;
    }

    const response = await api.get<FetchNotesResponse>("/notes", { params });
    return response.data;
  } catch (error) {
    console.error("Fetch notes failed:", error);
    alert("API token is missing. ");
    throw error;
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const response = await api.delete<Note>(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Delete note ${id} failed:`, error);
    alert("Not seeing the note.");
    throw error;
  }
};

export const addNote = async (noteData: NewNoteData): Promise<Note> => {
  if (!noteData.tag || noteData.tag.length === 0) {
    throw new Error("You must provide at least one tag.");
  }
  try {
    const response = await api.post<Note>("/notes", noteData);
    return response.data;
  } catch (error) {
    console.error("Add note failed:", error);
    alert("Not far-fetched by a note.");
    throw error;
  }
};

export const getSingleNote = async (id: string): Promise<Note> => {
  try {
    const res = await api.get<Note>(`/notes/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Get note ${id} failed:`, error);
    alert("Do not splurge on the note.");
    throw error;
  }
};

export const fetchTags = async (): Promise<string[]> => {
  try {
    const response = await api.get("/notes", {
      params: { page: 1, perPage: 20 },
    });

    const data = response.data;
    const notes = Array.isArray(data) ? data : data.notes;
    const tagsSet = new Set<string>();

    notes.forEach((note: { tag?: string }) => {
      if (note.tag) tagsSet.add(note.tag);
    });

    return ["All", ...Array.from(tagsSet)];
  } catch (error) {
    console.error("Fetch tags failed:", error);
    return ["All"];
  }
};
