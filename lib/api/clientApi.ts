import { nextServer } from "./api";

import { User } from "../../types/user";
import { NewNoteData, Note } from "@/types/note";
import { FetchNotesResponse } from "@/types/fetchNotesResponse";

type CheckSessionRequest = {
  success: boolean;
};

export type RegisterRequest = {
  email: string;
  password: string;
  userName: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

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

    const response = await nextServer.get<FetchNotesResponse>("/notes", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Fetch notes failed:", error);

    throw error;
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const response = await nextServer.delete<Note>(`/notes/${id}`, {});
    return response.data;
  } catch (error) {
    console.error(`Delete note ${id} failed:`, error);

    throw error;
  }
};

export const addNote = async (noteData: NewNoteData): Promise<Note> => {
  if (!noteData.tag || noteData.tag.length === 0) {
    throw new Error("You must provide at least one tag.");
  }
  try {
    const response = await nextServer.post<Note>("/notes", noteData, {});
    return response.data;
  } catch (error) {
    console.error("Add note failed:", error);

    throw error;
  }
};

export const getSingleNote = async (id: string): Promise<Note> => {
  try {
    const res = await nextServer.get<Note>(`/notes/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Get note ${id} failed:`, error);

    throw error;
  }
};

// export const fetchTags = async (): Promise<string[]> => {
//   try {
//     const response = await nextServer.get("/notes", {
//       params: { page: 1, perPage: 20 },
//     });

//     const data = response.data;
//     const notes = Array.isArray(data) ? data : data.notes;
//     const tagsSet = new Set<string>();

//     notes.forEach((note: { tag?: string }) => {
//       if (note.tag) tagsSet.add(note.tag);
//     });

//     return ["All", ...Array.from(tagsSet)];
//   } catch (error) {
//     console.error("Fetch tags failed:", error);
//     return ["All"];
//   }
// };

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

//

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};

export const getMe = async () => {
  const res = await nextServer.get<User>("/users/me");
  return res.data;
};
export type UpdateMePayload = {
  username?: string;
  email?: string;
};

export const updateMe = async (payload: UpdateMePayload): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", payload);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};
