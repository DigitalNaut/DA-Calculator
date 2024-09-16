import Equation from "src/components/Equation";
import { newExpression } from "src/logic/equation-wrangler";

const expression1 = newExpression([
  {
    numerator: { factor: 2, labels: new Map([["grapes", 1]]) },
    denominator: { factor: 1, labels: new Map([["m", 1]]) },
  },
  {
    numerator: { factor: 60, labels: new Map([["m", 1]]) },
    denominator: { factor: 1, labels: new Map([["h", 1]]) },
  },
  {
    numerator: { factor: 24, labels: new Map([["h", 1]]) },
    denominator: { factor: 1, labels: new Map([["d", 1]]) },
  },
  {
    numerator: { factor: 5, labels: new Map([["d", 1]]) },
  },
]);
// const expression2 = newExpression([
//   { numerator: { factor: 15, labels: new Map([["wood", 1]]) } },
//   {
//     numerator: { factor: 4, labels: new Map([["planks", 1]]) },
//     denominator: { factor: 1, labels: new Map([["wood", 1]]) },
//   },
//   {
//     numerator: { factor: 1, labels: new Map([["slabs", 1]]) },
//     denominator: { factor: 3, labels: new Map([["planks", 1]]) },
//   },
// ]);
// const expression3 = newExpression([
//   {
//     numerator: { factor: 2, labels: new Map([["grapes", 1]]) },
//     denominator: { factor: 1, labels: new Map([["m", 1]]) },
//   },
//   {
//     numerator: { factor: 60, labels: new Map([["m", 1]]) },
//     denominator: { factor: 1, labels: new Map([["h", 1]]) },
//   },
//   {
//     numerator: { factor: 24, labels: new Map([["h", 1]]) },
//     denominator: { factor: 1, labels: new Map([["d", 1]]) },
//   },
// ]);

export default function Home(): JSX.Element {
  return (
    <div className="flex h-screen w-screen items-center bg-gray-900 p-6">
      <div className="flex h-28 w-full flex-col items-center">
        <Equation input={expression1} />
        {/* <Equation input={expression2} />
        <Equation input={expression3} /> */}
      </div>
    </div>
  );
}
