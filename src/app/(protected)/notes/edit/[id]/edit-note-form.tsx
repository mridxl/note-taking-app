"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { noteSchema } from "@/lib/schemas";
import { Wand, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { readStreamableValue } from "ai/rsc";
import {
  fetchNoteById,
  updateNoteById,
  generateAISummary,
} from "../../actions";
import { toast } from "react-hot-toast";
import { handleError } from "@/lib/utils";

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
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

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
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      await queryClient.invalidateQueries({ queryKey: ["note", noteId] });

      toast.success("Note updated successfully");
      router.push("/notes");
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

  const handleGenerateSummary = async () => {
    // Don't generate if there's no content
    if (!formData.content) {
      toast.error("Please write some content before generating a summary");
      return;
    }

    setIsGeneratingSummary(true);
    setFormData((prev) => ({ ...prev, summary: "" }));

    try {
      const { summary, error } = await generateAISummary(formData.content);

      if (error) {
        toast.error(error);
        throw new Error(error);
      }

      if (summary) {
        let accumulatedSummary = "";
        try {
          for await (const chunk of readStreamableValue(summary)) {
            accumulatedSummary += chunk;
            setFormData((prev) => ({ ...prev, summary: accumulatedSummary }));
          }
        } catch (streamError) {
          console.error("Error reading summary stream:", streamError);
          throw new Error("Error reading summary stream");
        }
      } else {
        throw new Error("No summary was generated");
      }
    } catch (error) {
      toast.error(handleError(error).error);
      return;
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use safeParse instead of parse to avoid throwing errors
    const validation = noteSchema.safeParse(formData);

    if (!validation.success) {
      // Handle validation errors using the format from auth-form
      const errorMessage = validation.error.errors[0]!.message;
      toast.error(errorMessage);
      return;
    }
    // Call the update mutation
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
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="summary">Summary</Label>
              <Button
                type="button"
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary || !formData.content}
                className="flex w-38 items-center gap-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white transition-all duration-300 ease-in-out hover:from-purple-600 hover:to-blue-600 disabled:opacity-100 disabled:grayscale"
              >
                <Wand className="h-4 w-4" />
                {isGeneratingSummary ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
            <Textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="A brief summary of your note..."
              rows={11}
              className="resize-none"
            />
          </div>
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
