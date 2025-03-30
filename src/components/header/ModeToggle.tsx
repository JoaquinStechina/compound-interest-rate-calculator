"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  if (theme === "light") {
    return (
      <Button
        className="cursor-pointer"
        variant="ghost"
        size="sm"
        onClick={() => setTheme("dark")}
      >
        <Moon className="text-primary absolute h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  } else {
    return (
      <Button
        className="cursor-pointer"
        variant="ghost"
        size="sm"
        onClick={() => setTheme("light")}
      >
        <Sun className="text-primary h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }
}
