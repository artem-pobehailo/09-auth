"use client";

import { getSingleNote } from "@/lib/api/serverApi";
import css from "./NoteDetails.module.css";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => getSingleNote(id),
    refetchOnMount: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading note.</div>;

  const formattedDate = data.updatedAt
    ? `Updated at: ${new Date(data.updatedAt).toLocaleDateString()}`
    : `Created at: ${new Date(data.createdAt).toLocaleDateString()}`;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{data.title}</h2>
        </div>
        <p className={css.content}>{data.content}</p>
        {data.tag && <p className={css.tag}>Tag: {data.tag}</p>}
        <p className={css.date}>{formattedDate}</p>
      </div>
    </div>
  );
}
