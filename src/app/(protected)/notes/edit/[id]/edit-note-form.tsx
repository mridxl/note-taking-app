"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { noteSchema } from "@/lib/schemas";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNoteById, updateNoteById } from "../../actions";
import { toast } from "react-hot-toast";
import SummaryGenerator from "@/components/summary-generator";

interface EditNoteFormProps {
  noteId: string;
}

export default function EditNoteForm({ noteId }: EditNoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  useEffect(() => {
    if (data?.note) {
      setFormData({
        title: data.note.title ?? "",
        content: data.note.content ?? "",
        summary: data.note.summary ?? "",
      });
    }
  }, [data]);

  const { mutate: updateNote, isPending: isSaving } = useMutation({
    mutationFn: (formData: {
      title: string;
      content: string;
      summary: string;
    }) => updateNoteById(noteId, formData),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["notes"] }),
        queryClient.invalidateQueries({ queryKey: ["note", noteId] }),
      ]);
      toast.success("Note updated successfully");
      router.push("/notes/" + noteId);
    },
    onError: (error) => {
      console.error("Error updating note:", error);
      toast.error("Failed to update note. Please try again.");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSummaryChange = useCallback((summary: string) => {
    setFormData((prev) => ({ ...prev, summary }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = noteSchema.safeParse(formData);

    if (!validation.success) {
      const errorMessage = validation.error.errors[0]!.message;
      toast.error(errorMessage);
      return;
    }
    updateNote(formData);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
        <div className="order-1 md:order-2 md:col-start-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter note title"
            />
          </div>
        </div>

        <div className="order-2 md:order-1 md:row-span-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your note content here..."
              rows={20}
              className="h-full resize-none"
            />
          </div>
        </div>

        <div className="order-3 md:col-start-2">
          <SummaryGenerator
            content={formData.content}
            summary={formData.summary}
            onSummaryChange={handleSummaryChange}
          />
        </div>

        <div className="order-4 md:col-start-2">
          <div className="mt-4 flex justify-end gap-4">
            <Button
              type="button"
              variant="neutral"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
