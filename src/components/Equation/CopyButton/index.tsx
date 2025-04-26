import {
  faCheck,
  faCopy,
  faSpinner,
  faTriangleExclamation,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEventHandler, useCallback, useState } from "react";

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
}: {
  content: string;
  className?: string;
}) {
  const [state, setState] = useState<CopyButtonState>("idle");

  const resetAfterTimeout = () => {
    setTimeout(() => {
      setState("idle");
    }, 2000);
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
      className={className}
      type="button"
      disabled={state !== "idle"}
      onClick={onClickHandler}
    >
      <FontAwesomeIcon icon={stateIcon[state]} />
    </button>
  );
}
