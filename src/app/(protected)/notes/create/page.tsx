"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { noteSchema } from "@/lib/schemas";
import { Wand, Loader2 } from "lucide-react";
import { generateAISummary, createNote } from "../actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { readStreamableValue } from "ai/rsc";
import { handleError } from "@/lib/utils";

export default function CreateNotePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
  });
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const { mutate: createNoteMutation, isPending: isCreating } = useMutation({
    mutationFn: (data: { title: string; content: string; summary: string }) =>
      createNote(data),
    onSuccess: () => {
      toast.success("Note created successfully");
      router.push("/notes");
    },
    onError: (error) => {
      console.error("Error creating note:", error);
      toast.error("Failed to create note. Please try again.");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateSummary = async () => {
    if (!formData.content) {
      toast.error("Please enter content to generate a summary.");
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

    const validation = noteSchema.safeParse(formData);

    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message;
      if (errorMessage) toast.error(errorMessage);
      return;
    }
    createNoteMutation(formData);
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="mb-6">
        <h1 className="font-heading text-2xl">Create New Note</h1>
        <p className="text-foreground/70">Add a new note to your collection</p>
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
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Save Note"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
