"use client";

type ToggleButtonProps = {
    label: string;
    pressed: boolean;
    onPressedChange: (pressed: boolean) => void;
    annotation?: {
        text: string;
        side: "left" | "right";
    };
};

export default function ToggleButton({
    label,
    pressed,
    onPressedChange,
    annotation,
}: ToggleButtonProps) {
    return (
        <button
            type="button"
            aria-pressed={pressed}
            aria-label={annotation ? label : undefined}
            onClick={() => onPressedChange(!pressed)}
            className={`group relative inline-flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-1.5 py-1 text-[12px] font-medium text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${annotation ? "min-h-12" : "min-h-10"}`}
        >
            <span aria-hidden="true" className="toggle-track group-active:scale-[0.97]">
                <span className="toggle-thumb">
                    <span className="toggle-core" />
                </span>
            </span>

            {annotation ? (
                <span
                    aria-hidden="true"
                    className={`absolute top-1/2 h-8 w-13 text-accent ${annotation.side === "left"
                        ? "right-full mr-1"
                        : "left-full ml-1"
                    }`}
                >
                    <svg
                        viewBox="0 0 52 32"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        focusable="false"
                        className={`block h-8 w-13 ${annotation.side === "left" ? "-scale-x-100" : ""}`}
                    >
                        <path d="M3 5 C22 2 41 8 43 27 M36 20 L43 28 L49 20" />
                        <path d="M4 6 C23 3 42 9 42 27 M37 21 L42 28 L48 21" opacity="0.55" />
                    </svg>
                    <span className={`absolute top-full mt-2 w-24 text-center font-handwriting text-xl font-normal leading-5 sm:w-28 sm:text-2xl sm:leading-6 ${annotation.side === "left" ? "right-[43px] translate-x-1/2" : "left-[43px] -translate-x-1/2"}`}>
                        {annotation.text}
                    </span>
                </span>
            ) : (
                <span>{label}</span>
            )}
        </button>
    );
}
