import { fetchNotes } from "./actions";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import NotesClientComponent from "./notes-client";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  return (
    <div className="mx-auto py-10">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClientComponent />
      </HydrationBoundary>
    </div>
  );
}
