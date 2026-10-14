"use client";

import { Menu } from "@base-ui/react/menu";
import { play } from "cuelume";
import { ArrowUpRight, Mail } from "lucide-react";
import { contactLinks } from "@/data/contacts";
import { cn } from "@/lib/cn";
import { themeIconButtonClass, themeIconTrackClass } from "./theme";

const itemClassName =
  "flex min-h-10 items-center justify-between gap-6 rounded-control px-3 py-2 text-sm text-ink outline-none data-highlighted:bg-hover data-highlighted:inset-ring-2 data-highlighted:inset-ring-accent-ink data-disabled:cursor-default data-disabled:text-ink-2";

export function ContactMenu() {

  return (
    <Menu.Root
      onOpenChange={(open) => {
        play(open ? "open" : "close", { theme: "mech", emphasis: "strong", volume: 0.3 });
      }}
    >
      <span className={themeIconTrackClass}>
        <Menu.Trigger
          aria-label="Contatti"
          title="Contatti"
          className={cn(
            themeIconButtonClass,
            "data-popup-open:bg-(--gray-4) data-popup-open:text-foreground",
          )}
        >
          <Mail aria-hidden="true" size={13} />
        </Menu.Trigger>
      </span>
      <Menu.Portal>
        <Menu.Positioner
          side="top"
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 max-w-[calc(100vw-2rem)] outline-none"
        >
          <Menu.Popup className={({ open, transitionStatus }) =>
            `t-dropdown contact-menu w-52 max-w-full rounded-window bg-surface p-1.5 text-ink shadow-overlay outline-none ${transitionStatus === "ending" ? "is-closing" : open && transitionStatus !== "starting" ? "is-open" : ""}`
          }>
            {contactLinks.map(({ label, href }) =>
              href ? (
                <Menu.LinkItem
                  key={label}
                  href={href}
                  label={label}
                  closeOnClick
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className={itemClassName}
                >
                  {label}
                  {href.startsWith("mailto:") ? (
                    <Mail aria-hidden="true" className="size-4 text-ink-2" />
                  ) : (
                    <ArrowUpRight aria-hidden="true" className="size-4 text-ink-2" />
                  )}
                </Menu.LinkItem>
              ) : (
                <Menu.Item key={label} disabled className={itemClassName}>
                  {label}
                </Menu.Item>
              ),
            )}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
