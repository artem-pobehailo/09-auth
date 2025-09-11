"use client";

import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/Modal/Modal";
import { getSingleNote } from "@/lib/api/api";
import { useParams, useRouter } from "next/navigation";
import css from "./NotePreview.module.css";

export default function NotePreviewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => getSingleNote(id),
    refetchOnMount: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading note.</div>;

  return (
    <Modal onClose={handleClose}>
      <button onClick={handleClose} className={css.backBtn}>
        ← Back
      </button>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{data.title}</h2>
          </div>
          <p className={css.content}>{data.content}</p>
          {data.tag && <span className={css.tag}>{data.tag}</span>}
        </div>
      </div>
    </Modal>
  );
}
