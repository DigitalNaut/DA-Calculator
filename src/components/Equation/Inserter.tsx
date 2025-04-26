import type { MouseEventHandler } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

export default function Inserter({
  onClick,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      className="outline-hidden relative flex h-full w-1 cursor-text flex-col items-center justify-between rounded-md text-transparent hover:bg-blue-800 hover:text-blue-500 focus:bg-blue-800 focus:text-blue-500"
      onClick={onClick}
    >
      <FontAwesomeIcon
        icon={faAngleDown}
        className="absolute top-[-1em]"
        size="xs"
      />
      <FontAwesomeIcon
        icon={faAngleUp}
        className="absolute bottom-[-1em]"
        size="xs"
      />
    </button>
  );
}
