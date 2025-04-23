import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function NotesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Notes</h1>
        <Link href="/notes/create">
          <Button className="flex items-center" variant="default">
            <Plus size={18} />
            <span>Create Note</span>
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <p>
          Your notes will appear here. This page is still under development.
        </p>
      </div>
    </div>
  );
}
