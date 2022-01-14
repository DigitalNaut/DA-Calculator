import React from 'react';

import { ISubunit } from './types';

export default function Subunit({ input }: ISubunit) {
  if (typeof input === 'string')
    return (
      <input disabled className="w-min p-2 bg-green-100 text-green-900 text-center" value={input} />
    );

  if (!input[1]?.length && input[0] === 1) return <></>;

  return (
    <input
      disabled
      className="w-full p-2 bg-green-700 text-center"
      value={input[1]?.length ? `${input[0]} ${input[1]}` : input[0]}
    />
  );
}
