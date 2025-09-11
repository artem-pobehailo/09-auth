"use client";

import { useState, useEffect } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import Link from "next/link";

import css from "./NotesPage.module.css";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import NoteList from "@/components/NoteList/NoteList";
import { fetchNotes, FetchNotesResponse } from "@/lib/api/serverApi";

interface Props {
  tag?: string;
}

export default function NoteClient({ tag }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const perPage = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, tag]);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", currentPage, debouncedSearchQuery, tag],
    queryFn: () => fetchNotes(debouncedSearchQuery, currentPage, perPage, tag),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={setSearchQuery} />

        <Link href="/notes/action/create"> Create note + </Link>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && notes.length > 0 && (
        <>
          <NoteList notes={notes} />
          {totalPages > 1 && (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {!isLoading && !isError && notes.length === 0 && <p>No notes found</p>}
    </div>
  );
}
