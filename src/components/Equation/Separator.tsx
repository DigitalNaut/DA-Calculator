import { MouseEventHandler } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

type Props = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};
export default function Separator({ onClick }: Props) {
  return (
    <button
      type="button"
      className="relative m-[2px] flex h-full w-1 cursor-text flex-col items-center justify-between rounded-md text-transparent outline-none hover:bg-blue-800 hover:text-blue-500 focus:bg-blue-800 focus:text-blue-500"
      onClick={onClick}
    >
      <FontAwesomeIcon
        icon={faAngleDown}
        className="absolute -top-[1em]"
        size="xs"
      />
      <FontAwesomeIcon
        icon={faAngleUp}
        className="absolute -bottom-[1em]"
        size="xs"
      />
    </button>
  );
}
