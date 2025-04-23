"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { noteSchema } from "@/lib/schemas";
import { Wand, Loader2 } from "lucide-react";
import { findNoteById, updateNote } from "@/lib/mock";

interface EditNotePageProps {
  params: {
    id: string;
  };
}

export default function EditNotePage({ params }: EditNotePageProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch the note data from mock data
  useEffect(() => {
    // Simulate a short loading delay
    const timer = setTimeout(() => {
      const note = findNoteById(params.id);

      if (note) {
        setFormData({
          title: note.title || "",
          content: note.content || "",
          summary: note.summary || "",
        });
      } else {
        // Handle case when note is not found
        console.error("Note not found");
        // Optionally redirect to notes page
        // router.push("/notes");
      }

      setIsLoading(false);
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
  }, [params.id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateSummary = async () => {
    // Don't generate if there's no content
    if (!formData.content) {
      setErrors((prev) => ({
        ...prev,
        content: "Please write some content before generating a summary",
      }));
      return;
    }

    setIsGeneratingSummary(true);
    try {
      // In a real implementation, this would call an AI service
      // For now, just create a simple summary based on the content
      const summary = formData.content
        .split(" ")
        .slice(0, 20)
        .join(" ")
        .concat("...");

      // Add a short delay to simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 800));

      setFormData((prev) => ({ ...prev, summary }));
      // Clear any errors for the summary field
      setErrors((prev) => ({ ...prev, summary: "" }));
    } catch {
      setErrors((prev) => ({
        ...prev,
        summary: "Failed to generate summary. Please try again.",
      }));
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate the form data
      noteSchema.parse(formData);

      // Form is valid - clear any existing errors
      setErrors({});
      setIsSaving(true);

      // Update the note using mock data
      const updatedNote = updateNote(params.id, {
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
      });

      if (!updatedNote) {
        throw new Error("Failed to update note");
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect to the notes page
      router.push("/notes");
      router.refresh();
    } catch (error: any) {
      // Handle validation errors
      const fieldErrors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path[0];
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error("Error updating note:", error);
        alert("Failed to update note. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="mb-6">
        <h1 className="font-heading text-2xl">Edit Note</h1>
        <p className="text-foreground/70">Update your note details</p>
      </div>

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
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
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
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content}</p>
              )}
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
                rows={8}
                className="resize-none"
              />
              {errors.summary && (
                <p className="text-sm text-red-500">{errors.summary}</p>
              )}
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
    </div>
  );
}
