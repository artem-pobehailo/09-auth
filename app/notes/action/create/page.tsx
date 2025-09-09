import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";
import { Metadata } from "next";

import { addNote, fetchTags, getSingleNote } from "@/lib/api";

export const metadata: Metadata = {
  title: "Create a new note – NoteHub",
  description: "Create a new note quickly and easily in NoteHub.",
  openGraph: {
    title: "Create a new note – NoteHub",
    description: "Create a new note quickly and easily in NoteHub.",
    url: "http://localhost:3000/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub – create note",
      },
    ],
    siteName: "NoteHub",
    type: "article",
  },
};

const CreateNote = async () => {
  const tags = await fetchTags();
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm tags={tags} />
      </div>
    </main>
  );
};

export default CreateNote;
