import { fetchNoteById } from "../../actions";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import EditNoteForm from "./edit-note-form";

interface EditNotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditNotePage({ params }: EditNotePageProps) {
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
    <div className="mx-auto max-w-6xl p-4">
      <div className="mb-6">
        <h1 className="font-heading text-2xl">Edit Note</h1>
        <p className="text-foreground/70">Update your note details</p>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditNoteForm noteId={id} />
      </HydrationBoundary>
    </div>
  );
}
