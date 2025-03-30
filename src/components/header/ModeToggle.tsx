"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  if (theme === "light") {
    return (
      <Button variant="outline" size="icon" onClick={() => setTheme("dark")}>
        <Moon className="absolute h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  } else {
    return (
      <Button variant="outline" size="icon" onClick={() => setTheme("light")}>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }
}
