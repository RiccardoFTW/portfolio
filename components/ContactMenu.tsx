"use client";

import { Menu } from "@base-ui/react/menu";
import { play } from "cuelume";
import { ArrowUpRight, ChevronDown, Mail } from "lucide-react";
import { contactLinks } from "@/data/contacts";

const itemClassName =
  "flex min-h-10 items-center justify-between gap-6 rounded-control px-3 py-2 text-sm text-ink outline-none data-highlighted:bg-hover data-highlighted:inset-ring-2 data-highlighted:inset-ring-accent-ink data-disabled:cursor-default data-disabled:text-ink-2";

export function ContactMenu() {
  const hasContacts = contactLinks.some(({ href }) => href !== null);

  return (
    <Menu.Root
      onOpenChange={(open) => {
        play(open ? "open" : "close", { theme: "mech", emphasis: "strong", volume: 0.3 });
      }}
    >
      <Menu.Trigger className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-control bg-surface data-pressed:scale-[0.97] px-3.5 py-2 text-sm font-medium text-ink shadow-btn focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink [@media(hover:hover)_and_(pointer:fine)]:hover:bg-hover data-popup-open:bg-hover">
        Contattami!
        <ChevronDown aria-hidden="true" className="size-4 text-ink-2" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner
          side="top"
          align="center"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 max-w-[calc(100vw-2rem)] outline-none"
        >
          <Menu.Popup className="w-52 max-w-full origin-(--transform-origin) rounded-window bg-surface p-1.5 text-ink shadow-overlay outline-none transition-[transform,opacity] duration-250 ease-out-strong data-starting-style:scale-[0.98] data-starting-style:opacity-0 data-ending-style:duration-150 data-ending-style:scale-[0.98] data-ending-style:opacity-0 motion-reduce:transition-opacity motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100">
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

            {!hasContacts && (
              <p className="px-3 pt-2 pb-1 text-pretty text-xs leading-5 text-ink-2">
                Contatti presto disponibili.
              </p>
            )}

          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
