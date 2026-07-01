import { FeedbackComponent } from "@/components/feedback/FeedbackComponent";
import { HoldToDeleteButton } from "@/components/hold-to-delete/HoldToDeleteButton";
import { LikeButton, TorchButton } from "@/components/press-fill/PressFillButton";
import { Panel } from "@/components/Panel";
import { ToastStack } from "@/components/toast/ToastStack";

function CardHoverPreview() {
  return (
    <button
      type="button"
      className="group relative flex h-60 w-full shrink-0 items-end overflow-hidden rounded-(--radius-component) border border-(--component-border) bg-(--component-surface) p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-(--panel) sm:h-72"
    >
      <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground transition-opacity duration-240 group-hover:opacity-0 group-focus-visible:opacity-0">
        Hover me!
      </p>
      <Panel title="Ehi!" description="Ciao! This is a panel that appears at hover! :)" />
    </button>
  );
}

function FeedbackPreview() {
  return (
    <div className="flex h-60 shrink-0 items-center justify-center rounded-(--radius-component) border border-(--component-border) bg-(--component-surface) px-4 sm:h-72">
      <FeedbackComponent />
    </div>
  );
}

function ToastPreview() {
  return (
    <div className="flex h-60 shrink-0 items-center justify-center rounded-(--radius-component) border border-(--component-border) bg-(--component-surface) px-4 sm:h-72">
      <ToastStack />
    </div>
  );
}

function HoldToDeletePreview() {
  return (
    <div className="flex h-60 shrink-0 items-center justify-center rounded-(--radius-component) border border-(--component-border) bg-(--component-surface) px-4 sm:h-72">
      <HoldToDeleteButton />
    </div>
  );
}

function PressFillPreview() {
  return (
    <div className="flex h-60 shrink-0 items-center justify-center gap-8 rounded-(--radius-component) border border-(--component-border) bg-(--component-surface) px-4 sm:h-72">
      <TorchButton />
      <LikeButton />
    </div>
  );
}

export function ComponentsPanel() {
  return (
    <section
      aria-label="Components"
      className="mx-auto flex w-full max-w-(--width-components) flex-col gap-4 pb-2"
    >
      <CardHoverPreview />
      <FeedbackPreview />
      <ToastPreview />
      <HoldToDeletePreview />
      <PressFillPreview />
    </section>
  );
}
