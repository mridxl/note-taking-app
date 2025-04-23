import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "rounded-base border-border bg-secondary-background selection:bg-main selection:text-main-foreground font-base text-foreground placeholder:text-foreground/50 focus-visible:rind-0 flex min-h-[80px] w-full border-2 px-3 py-2 text-sm focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
