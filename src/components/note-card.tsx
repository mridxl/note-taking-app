"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { deleteNote } from "@/lib/mock";

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    summary?: string | null;
    created_at: string;
    updated_at: string;
  };
}

export function NoteCard({ note }: NoteCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date to be more readable
  const formattedDate = new Date(note.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this note?")) {
      setIsDeleting(true);
      try {
        // Use the mock delete function
        const success = deleteNote(note.id);

        if (!success) {
          throw new Error("Failed to delete note");
        }

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Refresh the notes list
        router.refresh();
      } catch (error) {
        console.error("Error deleting note:", error);
        alert("Failed to delete note. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="flex h-full min-h-[250px] flex-col bg-[var(--card-bg)] transition-all hover:shadow-md">
      <CardHeader className="flex min-h-[70px] flex-col">
        <div className="flex justify-between gap-3">
          <CardTitle className="line-clamp-1 h-7 overflow-hidden text-xl">
            {note.title}
          </CardTitle>
          <div className="flex shrink-0 gap-2">
            <Link href={`/notes/edit/${note.id}`}>
              <Button
                variant="noShadow"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
              >
                <span className="sr-only">Edit</span>
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="noShadow"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <span className="sr-only">Delete</span>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>Last updated {formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {note.summary ?? note.content.substring(0, 300)}
        </p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Link href={`/notes/${note.id}`} className="w-full">
          <Button variant="noShadow" className="w-full">
            View Note
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
