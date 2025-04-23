import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { signout } from "../../(auth)/actions";

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
        <div className="flex items-center gap-4">
          <p>Hello {data.user.email}</p>
          <form action={signout}>
            <Button type="submit">Sign out</Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6">
        <p>
          Your notes will appear here. This page is still under development.
        </p>
      </div>
    </div>
  );
}
