import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

type Props = {
  onClick?(): void;
};
export default function Separator({ onClick }: Props) {
  return (
    <button
      type="button"
      className="relative flex flex-col items-center justify-between w-1 h-full rounded-md text-transparent hover:bg-blue-800 hover:text-blue-500 cursor-text"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faAngleDown} className="absolute -top-[1em]" size="xs" />
      <FontAwesomeIcon icon={faAngleUp} className="absolute -bottom-[1em]" size="xs" />
    </button>
  );
}
