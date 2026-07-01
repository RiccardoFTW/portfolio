type ProgressiveBlurProps = {
  edge: "top" | "bottom";
};

export function ProgressiveBlur({ edge }: ProgressiveBlurProps) {
  return (
    <div
      aria-hidden="true"
      className={edge === "top" ? "edge-blur edge-blur--top" : "edge-blur edge-blur--bottom"}
    />
  );
}
