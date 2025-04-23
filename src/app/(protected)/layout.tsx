import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-switcher";
import { signout } from "../(auth)/actions";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-border bg-header-background border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/notes" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="1811 labs logo"
                width="32"
                height="32"
                className="rounded-md"
              />
              <span className="decoration-foreground after:bg-foreground relative text-xl font-bold after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100">
                1811 Notes
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-sm">Hello, {data.user.email}</p>
            <ModeToggle />
            <form action={signout}>
              <Button type="submit" variant="neutral" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
