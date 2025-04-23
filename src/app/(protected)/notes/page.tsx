"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { NoteCard } from "@/components/note-card";
import { mockNotes } from "@/lib/mock";

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Using mock data instead of Supabase
  const notes = mockNotes;

  // Filter notes based on search query
  const filteredNotes =
    searchQuery.trim() === ""
      ? notes
      : notes.filter(
          (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.summary?.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Notes</h1>
        <Link href="/notes/create">
          <Button className="flex items-center gap-2" variant="default">
            <Plus size={18} />
            <span>Create Note</span>
          </Button>
        </Link>
      </div>

      <div className="relative mb-6">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search notes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
          {searchQuery.trim() !== "" ? (
            <>
              <h3 className="mb-2 text-xl font-medium">
                No matching notes found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try using different keywords or clear the search
              </p>
              <Button onClick={() => setSearchQuery("")} variant="noShadow">
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
