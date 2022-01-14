import React from 'react';

import Separator from './Separator';
import Subunit from './Subunit';

import { IUnit } from './types';

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
