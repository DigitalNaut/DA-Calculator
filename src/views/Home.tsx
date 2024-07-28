import Expression from "src/components/Expression";
import { type ExpressionType } from "src/components/Expression/types";

const expression1: ExpressionType = [
  [
    [2, "grapes"],
    [1, "m"],
  ],
  [
    [60, "m"],
    [1, "h"],
  ],
  [
    [24, "h"],
    [1, "d"],
  ],
  [[5, "d"], [1]],
];
const expression2: ExpressionType = [
  [[15, "wood"]],
  [
    [4, "planks"],
    [1, "wood"],
  ],
  [
    [1, "slabs"],
    [3, "planks"],
  ],
];
const expression3: ExpressionType = [
  [
    [2, "grapes"],
    [1, "m"],
  ],
  [
    [60, "m"],
    [1, "h"],
  ],
  [
    [24, "h"],
    [1, "d"],
  ],
];

export default function Home(): JSX.Element {
  return (
    <div className="w-screen h-screen bg-gray-900 p-6">
      <div className="flex flex-col items-center w-full h-24">
        <Expression input={expression1} />
        <Expression input={expression2} />
        <Expression input={expression3} />
      </div>
    </div>
  );
}
