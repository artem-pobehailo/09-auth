import { nextServer } from "./api";

import { cookies } from "next/headers";
import { User } from "../../types/user";
import { FetchNotesResponse } from "@/types/FetchNotesResponse";
import { Note } from "@/types/note";

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
    const cookieStore = cookies();
    const response = await nextServer.get<FetchNotesResponse>("/notes", {
      params,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch notes failed:", error);

    throw error;
  }
};

// export const deleteNote = async (id: string): Promise<Note> => {
//   try {
//     const cookieStore = await cookies();
//     const response = await nextServer.delete<Note>(`/notes/${id}`, {
//       headers: {
//         Cookie: cookieStore.toString(),
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Delete note ${id} failed:`, error);

//     throw error;
//   }
// };

// export const addNote = async (noteData: NewNoteData): Promise<Note> => {
//   if (!noteData.tag || noteData.tag.length === 0) {
//     throw new Error("You must provide at least one tag.");
//   }
//   try {
//     const cookieStore = await cookies();
//     const response = await nextServer.post<Note>("/notes", noteData, {
//       headers: {
//         Cookie: cookieStore.toString(),
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Add note failed:", error);

//     throw error;
//   }
// };

export const getSingleNote = async (id: string): Promise<Note> => {
  try {
    const cookieStore = await cookies();
    const res = await nextServer.get<Note>(`/notes/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Get note ${id} failed:`, error);

    throw error;
  }
};

// export const fetchTags = async (): Promise<string[]> => {
//   try {
//     const cookieStore = await cookies();
//     const response = await nextServer.get("/notes", {
//       params: { page: 1, perPage: 20 },
//       headers: { Cookie: cookieStore.toString() },
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

// export const getUser = async () => {
//   const cookieStore = await cookies();
//   const res = await nextServer.get("/auth/me", {
//     headers: {
//       Cookie: cookieStore.toString(),
//     },
//   });
//   return res.data;
// };

export const checkServerSession = async () => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  // Повертаємо повний респонс, щоб middleware мав доступ до нових cookie
  return res;
};
export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
