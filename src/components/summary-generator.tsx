"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wand } from "lucide-react";
import { useCompletion } from "@ai-sdk/react";
import toast from "react-hot-toast";

interface SummaryGeneratorProps {
  content: string;
  summary: string;
  onSummaryChange: (summary: string) => void;
}

export default function SummaryGenerator({
  content,
  summary,
  onSummaryChange,
}: SummaryGeneratorProps) {
  const { isLoading, completion, setCompletion, complete } = useCompletion({
    api: "/api/summarize",
    initialCompletion: summary,
    onFinish(prompt, completion) {
      onSummaryChange(completion);
      toast.success("Summary generated successfully");
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="summary">Summary</Label>
        <Button
          onClick={async () => {
            if (content.length === 0) {
              toast.error(
                "Note content is empty. Please add some content before generating a summary.",
              );
              return;
            }
            setCompletion("");
            await complete(content);
          }}
          type="button"
          disabled={isLoading}
          className="flex w-38 items-center gap-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white transition-all duration-300 ease-in-out hover:from-purple-600 hover:to-blue-600 disabled:opacity-100 disabled:grayscale"
        >
          <Wand className="h-4 w-4" />
          {isLoading ? "Generating..." : "Generate with AI"}
        </Button>
      </div>

      <Textarea
        id="summary"
        name="summary"
        value={isLoading ? completion : summary}
        onChange={(e) => onSummaryChange(e.target.value)}
        placeholder="A brief summary of your note..."
        rows={11}
        className="resize-none"
      />
    </div>
  );
}
