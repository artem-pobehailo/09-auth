"use client";
import { useRouter } from "next/navigation";

import css from "./NoteForm.module.css";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewNoteData } from "@/types/note";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import { addNote } from "@/lib/api/clientApi";

interface NoteFormProps {
  tags: string[];
}

export default function NoteForm({ tags }: NoteFormProps) {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const queryClient = useQueryClient();
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const mutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
      clearDraft();
      router.push("/notes/filter/all");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData) as unknown as NewNoteData;

    if (!values.title || values.title.length < 3) {
      alert("Title must be at least 3 characters");
      return;
    }

    mutation.mutate(values);
  };
  const handleCancel = () => router.push("/notes/filter/all");

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          required
          className={css.input}
          value={draft?.title || ""}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft?.content || ""}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          required
          className={css.select}
          value={draft?.tag || ""}
          onChange={handleChange}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button type="submit" className={css.submitButton}>
          {mutation.isPending ? "Create note ..." : "Create"}
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
