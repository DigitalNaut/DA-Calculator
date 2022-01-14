import React from 'react';
import { ISubunit, IUnit } from './types';

export function Separator() {
  return <div className="w-full h-[1px] bg-white" />;
}

export function Subunit({ input }: ISubunit) {
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

type LabelProps = {
  input: string;
};

export function Label({ input }: LabelProps) {
  return <input disabled className="w-full p-2 bg-green-700 text-center" value={input} />;
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
