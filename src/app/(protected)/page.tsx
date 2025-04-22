import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { signout } from "../(auth)/actions";
import { Button } from "@/components/ui/button";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <>
      <p>Hello {data.user.email}</p>
      <form action={signout}>
        <Button type="submit">Sign out</Button>
      </form>
    </>
  );
}
