import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { fetchNoteById } from "../actions";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import NoteContent from "./note-content";

interface NotePageParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotePage({ params }: NotePageParams) {
  const queryClient = new QueryClient();
  const { id } = await params;

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const noteResult = await fetchNoteById(id);

  if (!noteResult.note) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/notes">
          <Button variant="noShadow" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Back to Notes</span>
          </Button>
        </Link>
        <Link href={`/notes/edit/${id}`}>
          <Button className="flex items-center gap-2">
            <Edit size={16} />
            <span>Edit Note</span>
          </Button>
        </Link>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteContent noteId={id} />
      </HydrationBoundary>
    </div>
  );
}
