import {
  faCheck,
  faCopy,
  faSpinner,
  faTriangleExclamation,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEventHandler, useCallback, useState } from "react";
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

  const onClickHandler: MouseEventHandler = useCallback(async (event) => {
    event.stopPropagation();
    event.preventDefault();
    try {
      setState("copying");
      await navigator.clipboard.writeText(content);
      setState("copied");
      resetAfterTimeout();
    } catch (error) {
      console.error("Failed to copy: ", error);
      setState("error");
      resetAfterTimeout();
    }
  }, []);

  return (
    <button
      className={twMerge("disabled:opacity-50", className)}
      aria-label="Copy to clipboard"
      type="button"
      disabled={state !== "idle" || disabled}
      title={state === "idle" ? "Copy to clipboard" : undefined}
      onClick={onClickHandler}
    >
      <FontAwesomeIcon icon={stateIcon[state]} />
    </button>
  );
}
