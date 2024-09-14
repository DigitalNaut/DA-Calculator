import Equation from "src/components/Equation";
import { newExpression } from "src/logic/equation-wrangler";

const expression1 = newExpression([
  {
    numerator: { factor: 2, labels: ["grapes"] },
    denominator: { factor: 1, labels: ["m"] },
  },
  {
    numerator: { factor: 60, labels: ["m"] },
    denominator: { factor: 1, labels: ["h"] },
  },
  {
    numerator: { factor: 24, labels: ["h"] },
    denominator: { factor: 1, labels: ["d"] },
  },
  {
    numerator: { factor: 5, labels: ["d"] },
  },
]);
// const expression2 = newExpression([
//   { numerator: { factor: 15, labels: ["wood"] } },
//   {
//     numerator: { factor: 4, labels: ["planks"] },
//     denominator: { factor: 1, labels: ["wood"] },
//   },
//   {
//     numerator: { factor: 1, labels: ["slabs"] },
//     denominator: { factor: 3, labels: ["planks"] },
//   },
// ]);
// const expression3 = newExpression([
//   {
//     numerator: { factor: 2, labels: ["grapes"] },
//     denominator: { factor: 1, labels: ["m"] },
//   },
//   {
//     numerator: { factor: 60, labels: ["m"] },
//     denominator: { factor: 1, labels: ["h"] },
//   },
//   {
//     numerator: { factor: 24, labels: ["h"] },
//     denominator: { factor: 1, labels: ["d"] },
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
