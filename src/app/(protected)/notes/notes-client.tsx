"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search } from "lucide-react";
import { NoteCard } from "@/components/note-card";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "./actions";
import { useIsMobile } from "@/hooks/useMobile";

export default function NotesClientComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  const notes = data?.notes ?? [];

  const filteredNotes =
    searchTerm.trim() === ""
      ? notes
      : notes.filter(
          (note) =>
            (note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ??
              false) ||
            (note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ??
              false) ||
            (note.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ??
              false),
        );

  return (
    <>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Notes</h1>
        <div className="flex items-end gap-4">
          <div className="flex items-center">
            <Search className="text-muted-foreground h-4 w-4 translate-x-6" />
            <Input
              placeholder={isMobile ? "Search" : "Search notes..."}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
          <Link href="/notes/create">
            <Button className="flex items-center gap-2" variant="default">
              <Plus size={18} />
              <span>Create Note</span>
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
          <h3 className="mb-2 text-xl font-medium text-red-500">
            Error loading notes
          </h3>
          <p className="text-muted-foreground mb-6">
            {error.message}. Please try refreshing the page.
          </p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex h-[calc(100vh-12rem)] flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
          {searchTerm.trim() !== "" ? (
            <>
              <h3 className="mb-2 text-xl font-medium">
                No matching notes found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try using different keywords or clear the search
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  window.history.replaceState(null, "", "/notes");
                }}
                variant="noShadow"
              >
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <h3 className="mb-2 text-xl font-medium">No notes yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first note to get started
              </p>
              <Link href="/notes/create">
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>Create Note</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-6 px-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </>
  );
}
