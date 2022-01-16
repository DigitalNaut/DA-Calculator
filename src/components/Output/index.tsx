import React from 'react';

type Props = {
  children: string;
  dimmed?: boolean;
};

export default function Output({ children, dimmed }: Props) {
  return (
    <input
      disabled
      className={[
        'p-2 m-1.5 text-center text-white bg-gray-800 rounded-2xl',
        dimmed ? 'text-gray-400 italic' : '',
      ].join(' ')}
      value={children}
    />
  );
}
