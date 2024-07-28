import LeftParen from "src/assets/LeftParen.svg?react";
import RightParen from "src/assets/RightParen.svg?react";

type Props = {
  right?: true;
};
export default function Parenthesis({ right }: Props) {
  const className = "w-2";

  if (right) return <RightParen className={className} />;
  return <LeftParen className={className} />;
}
