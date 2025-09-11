"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteList.module.css";

import Link from "next/link";
import { Note } from "@/types/note";
import { deleteNote } from "@/lib/api/clientApi";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setDeletingNoteId(null);
    },
    onError: () => {
      console.log("Error deleting note");
      setDeletingNoteId(null);
    },
  });

  if (!notes?.length) {
    return <p>No notes found</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => {
        const isDeleting = deletingNoteId === note.id;

        return (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <Link
                href={`/notes/${note.id}`}
                as={`/notes/${note.id}`}
                className={css.link}
              >
                View details
              </Link>
              <button
                className={css.button}
                disabled={isDeleting}
                onClick={() => {
                  setDeletingNoteId(note.id);
                  deleteNoteMutation.mutate(note.id);
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
