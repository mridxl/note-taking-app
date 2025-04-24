"use client";

import { ModeToggle } from "./theme-switcher";
import { signout } from "@/app/(auth)/actions";
import { Button } from "./ui/button";

export default function HeaderMenu({ email }: { email: string | undefined }) {
  const isMobile = window.innerWidth < 768;
  return (
    <div className="flex items-center gap-4">
      {!isMobile && <p className="text-sm">Hello, {email ?? "User"}!</p>}
      <ModeToggle />
      <form action={signout}>
        <Button type="submit" variant="neutral" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
