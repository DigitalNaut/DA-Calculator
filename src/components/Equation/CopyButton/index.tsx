import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  faCheck,
  faCopy,
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { MouseEventHandler } from "react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type CopyButtonState = "idle" | "copying" | "copied" | "error";

const stateIcon: Record<CopyButtonState, IconDefinition> = {
  idle: faCopy,
  copying: faSpinner,
  copied: faCheck,
  error: faTriangleExclamation,
};

export default function CopyButton({
  content,
  className,
  disabled = false,
}: {
  content: string;
  disabled: boolean;
  className?: string;
}) {
  const [state, setState] = useState<CopyButtonState>("idle");

  const resetAfterTimeout = () => {
    setTimeout(() => {
      setState("idle");
    }, 1000);
  };

  const onClickHandler: MouseEventHandler = async (event) => {
    event.stopPropagation();

    try {
      setState("copying");
      await navigator.clipboard.writeText(content);
      setState("copied");
      resetAfterTimeout();
    } catch (error) {
      console.error(
        "Failed to copy:",
        error instanceof Error ? error.message : error,
      );

      setState("error");
      resetAfterTimeout();
    }
  };

  return (
    <button
      className={twMerge(state !== "idle" && "disabled:opacity-50", className)}
      aria-label="Copy to clipboard"
      type="button"
      disabled={disabled || state !== "idle"}
      title={state === "idle" ? "Copy to clipboard" : undefined}
      onClick={onClickHandler}
    >
      <FontAwesomeIcon icon={stateIcon[state]} />
    </button>
  );
}
