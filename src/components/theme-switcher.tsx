"use client";

import * as React from "react";
import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    const switchTheme = () => {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
    };

    if (!document.startViewTransition) {
      switchTheme();
    } else {
      document.startViewTransition(switchTheme);
    }
  };

  return (
    <Button
      variant="neutral"
      size="icon"
      onClick={handleToggleTheme}
      aria-label="Toggle theme"
    >
      <SunMedium className="h-[1.2rem] w-[1.2rem] scale-150 rotate-0 fill-amber-500 transition-all duration-600 dark:scale-0 dark:-rotate-90 dark:fill-amber-500/30" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 fill-white/30 text-white transition-all duration-600 dark:scale-100 dark:rotate-0 dark:fill-white" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
