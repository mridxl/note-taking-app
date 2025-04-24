"use server";

import { createClient } from "@/lib/supabase/server";
import { handleError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export type Note = {
  id: string;
  title: string | null;
  content: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  embedding?: string | null;
};

/**
 * Fetches all notes for the current authenticated user
 */
export async function fetchNotes() {
  try {
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return { notes: data as Note[], error: null };
  } catch (error) {
    return {
      notes: null,
      error: handleError(error).error,
    };
  }
}

/**
 * Fetches a specific note by its ID
 */
export async function fetchNoteById(noteId: string) {
  try {
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", noteId)
      .eq("user_id", userData.user.id)
      .single();

    if (error) throw error;

    return { note: data, error: null };
  } catch (error) {
    return {
      note: null,
      error: handleError(error).error,
    };
  }
}

/**
 * Creates a new note
 */
export async function createNote(note: {
  title: string;
  content: string;
  summary?: string | null;
}) {
  try {
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("notes")
      .insert({
        title: note.title,
        content: note.content,
        summary: note.summary,
        user_id: userData.user.id,
      })
      .select();

    if (error) throw error;

    revalidatePath("/notes");

    return { note: data[0], error: null };
  } catch (error) {
    return {
      note: null,
      error: handleError(error).error,
    };
  }
}

/**
 * Updates an existing note
 */
export async function updateNoteById(
  noteId: string,
  note: {
    title?: string;
    content?: string;
    summary?: string | null;
  },
) {
  try {
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("notes")
      .update({
        title: note.title,
        content: note.content,
        summary: note.summary,
      })
      .eq("id", noteId)
      .select();

    if (error) throw error;

    revalidatePath("/notes");
    revalidatePath(`/notes/${noteId}`);

    return { note: data[0], error: null };
  } catch (error) {
    return {
      note: null,
      error: handleError(error).error,
    };
  }
}

/**
 * Deletes a note
 */
export async function deleteNoteById(noteId: string) {
  try {
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase.from("notes").delete().eq("id", noteId);

    if (error) throw error;

    revalidatePath("/notes");
    revalidatePath(`/notes/${noteId}`);

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: handleError(error).error,
    };
  }
}
