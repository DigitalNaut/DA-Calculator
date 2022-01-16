import React from 'react';

type Props = {
  children: string;
};

export default function Output({ children }: Props) {
  return (
    <input disabled className="p-2 m-1.5 text-center text-white bg-gray-800" value={children} />
  );
}
