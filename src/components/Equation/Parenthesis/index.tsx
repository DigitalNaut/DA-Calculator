import LeftParen from "src/assets/LeftParen.svg?react";
import RightParen from "src/assets/RightParen.svg?react";

const className = "w-2";

export default function Parenthesis({ right }: { right?: true }) {
  return right ? (
    <RightParen className={className} />
  ) : (
    <LeftParen className={className} />
  );
}
