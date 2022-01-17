import React from 'react';
import { ReactComponent as LeftParen } from 'src/assets/LeftParen.svg';
import { ReactComponent as RightParen } from 'src/assets/RightParen.svg';

type Props = {
  right?: true;
};
export default function Parenthesis({ right }: Props) {
  const className = 'w-2';

  if (right) return <RightParen className={className} />;
  return <LeftParen className={className} />;
}