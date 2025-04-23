import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import { findNoteById } from "@/lib/mock";

interface NotePageParams {
  params: {
    id: string;
  };
}

export default function NotePage({ params }: NotePageParams) {
  // Get the note from mock data
  const note = findNoteById(params.id);

  // If note doesn't exist, show 404
  if (!note) {
    notFound();
  }

  // Format date to be more readable
  const formattedDate = new Date(note.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/notes">
          <Button variant="noShadow" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Back to Notes</span>
          </Button>
        </Link>
        <Link href={`/notes/edit/${note.id}`}>
          <Button className="flex items-center gap-2">
            <Edit size={16} />
            <span>Edit Note</span>
          </Button>
        </Link>
      </div>

      <Card className="mb-6 border-none shadow-sm">
        <CardContent className="p-6">
          <h1 className="mb-2 text-3xl font-bold">{note.title}</h1>
          <p className="text-muted-foreground mb-6">
            Last updated: {formattedDate}
          </p>

          <div className="prose dark:prose-invert max-w-none">
            {note.content.split("\n\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
