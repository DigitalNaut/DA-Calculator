import React from 'react';
import { ISubunit, IUnit } from './types';

export function Separator() {
  return <div className="w-full h-[1px] bg-white" />;
}

export function Subunit({ input }: ISubunit) {
  return (
    <input
      disabled
      className="w-full p-2 bg-green-700 text-center"
      value={`${input[0]} ${input[1]}`}
    />
  );
}

export default function Unit({ input }: IUnit) {
  return (
    <div className="flex flex-col p-1 bg-green-900 w-max">
      <Subunit input={input[0]} />
      {input[1] && (
        <>
          <Separator />
          <Subunit input={input[1]} />
        </>
      )}
    </div>
  );
}
