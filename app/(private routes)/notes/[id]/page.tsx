// app/notes/[id]/page.tsx
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";

import { Metadata } from "next";
import { getSingleNote } from "@/lib/api/clientApi";

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}
export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await getSingleNote(id);
  const title = note?.title
    ? `Note: ${note.title} – NoteHub`
    : "Note details – NoteHub";
  return {
    title: `Note: ${title}`,
    description: note?.content?.slice(0, 50) || "No description available",
    openGraph: {
      title: `Note: ${title}`,
      description: note?.content?.slice(0, 50) || "No description available",
      url: `http://localhost:3000/notes/${id}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
      type: "article",
    },
  };
}

export default async function NoteDetails({ params }: NoteDetailsPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getSingleNote(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
