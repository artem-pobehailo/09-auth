import { fetchNotes } from "@/lib/api/serverApi";
import NoteClient from "./Notes.client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tagFromUrl = slug?.[0] ?? "All";
  const tag = tagFromUrl;
  return {
    title: `Note: ${tag}`,
    description: `View the notes filtered by: ${tag}`,
    openGraph: {
      title: `Note: ${tag}`,
      description: `View the notes filtered by: ${tag}`,
      url: `http://localhost:3000/notes/filter/${tag}`,
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

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const tagFromUrl = slug?.[0];
  const tag = tagFromUrl === "All" ? undefined : tagFromUrl;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", tag],
    queryFn: () => fetchNotes("", 1, 12, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteClient tag={tag} />
    </HydrationBoundary>
  );
}
