"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { Toggle } from "@base-ui/react/toggle";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

const themes = [
  { value: "system", label: "Tema di sistema", Icon: Monitor },
  { value: "dark", label: "Tema scuro", Icon: Moon },
  { value: "light", label: "Tema chiaro", Icon: Sun },
];
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export const themeIconTrackClass =
  "flex w-fit items-center gap-0.5 overflow-hidden rounded-md bg-(--gray-2) p-0.5";

export const themeIconButtonClass =
  "flex size-6 cursor-pointer items-center justify-center rounded-sm text-(--muted) outline-none hover:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink";

export const themeIconActiveClass = "bg-(--gray-4) text-foreground";

export function AppThemeSwitcher() {
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup
      aria-label="Tema del sito"
      value={mounted && theme ? [theme] : []}
      onValueChange={(values) => { if (values[0]) setTheme(values[0]); }}
      className={themeIconTrackClass}
    >
      {themes.map(({ value, label, Icon }) => (
        <Toggle
          key={value}
          value={value}
          aria-label={label}
          title={label}
          disabled={!mounted}
          className={cn(
            themeIconButtonClass,
            mounted && theme === value && themeIconActiveClass,
          )}
        >
          <Icon aria-hidden="true" size={13} />
        </Toggle>
      ))}
    </ToggleGroup>
  );
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider enableSystem attribute="class" storageKey="theme" defaultTheme="system" disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
