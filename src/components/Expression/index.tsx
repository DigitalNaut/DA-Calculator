import { faEquals } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";

import { type ExpressionType } from "src/components/Expression/types";
import Output from "src/components/Output";
import Unit from "src/components/Unit";
import { CustomInputChangeHandler, Input } from "src/components/Unit/types";
import {
  makeCompoundValue,
  stringifyIntoLabel,
} from "src/components/Unit/validation";

import Inserter from "./Separator";
import { cleanUpExpression, removeOverlap, removeUnits } from "./utility";

export default function Expression({ input }: { input: ExpressionType }) {
  const [expression, setExpression] = useState(input);
  const [numerator, setNumerator] = useState(0);
  const [denominator, setDenominator] = useState(0);
  const [labels, setLabels] = useState<string[][]>();
  const [wasInputChanged, setWasInputChanged] = useState(false);

  const reduceFactors = (index: 0 | 1) => {
    const reducedExpression = expression.reduce(
      (previousExpression, currentExpression) => {
        const factor = Number(currentExpression[index]?.[0]) || 1;

        if (typeof currentExpression[index]?.[0] === "number")
          return previousExpression * factor;

        return previousExpression;
      },
      1
    );

    return reducedExpression;
  };

  const reduceLabels = (index: 0 | 1) => {
    const reducedExpression = expression.reduce(
      (previousExpression, currentExpression) => {
        if (typeof currentExpression[index]?.[1] === "string")
          return [...previousExpression, currentExpression[index]?.[1] || ""];

        return previousExpression || "";
      },
      [] as string[]
    );

    return reducedExpression;
  };

  function joinLabels() {
    const upperLabels = reduceLabels(0);
    const lowerLabels = reduceLabels(1);

    return removeOverlap(upperLabels, lowerLabels);
  }

  const onClickResults = () => {
    // Update data
    setNumerator(reduceFactors(0));
    setDenominator(reduceFactors(1));
    setLabels(joinLabels());

    // Clean up
    setExpression(cleanUpExpression(expression));

    // Set flags
    setWasInputChanged(false);
  };

  const result = useMemo(() => {
    if (!numerator || !denominator) return "Result";

    const newResult = [`${(numerator / denominator).toFixed(2)}`];

    if (labels?.[0]) newResult.push(labels[0].join(" • "));

    if (labels?.[1]) {
      newResult.push(labels[1].length ? "/" : "");
      newResult.push(labels[1].join(" • "));
    }

    return newResult.join(" ");
  }, [numerator, denominator, labels]);

  const updateExpression: CustomInputChangeHandler = (
    userInput,
    index,
    subunit
  ) => {
    const isValidIndex = typeof index === "number" && index >= 0;
    const isValidSubunit = typeof subunit === "number" && subunit >= 0;

    if (!isValidIndex || !isValidSubunit) return;

    if (
      stringifyIntoLabel(userInput) !==
      stringifyIntoLabel(expression[index][subunit])
    )
      setWasInputChanged(true);

    setExpression((prevInput) => {
      const newExpression = prevInput;
      const newValue: Input = makeCompoundValue(userInput);

      newExpression[index][subunit] = newValue;
      return newExpression;
    });
  };

  const insertExpression = (index: number) => {
    expression.splice(index, 0, [[1]]);
  };

  const deleteUnit = (index: number) => {
    setExpression(
      removeUnits(expression, index, () => setWasInputChanged(true))
    );
  };

  return (
    <div className="flex items-center justify-center h-full m-1 bg-gray-800 rounded-md shadow-md w-max">
      <Inserter
        onClick={(e) => {
          insertExpression(0);
          e.currentTarget.blur();
        }}
      />
      {expression.map((aUnit, unitIndex) => {
        const keyHash = aUnit.toString() + unitIndex;
        return (
          <div
            className="flex items-center justify-center h-full"
            key={keyHash}
          >
            <Unit
              input={aUnit}
              onChangeInput={updateExpression}
              index={unitIndex}
              onDeleteUnit={() => deleteUnit(unitIndex)}
            />
            <Inserter
              onClick={(e) => {
                insertExpression(unitIndex + 1);
                e.currentTarget.blur();
              }}
            />
          </div>
        );
      })}
      <button
        type="button"
        className="flex items-center p-2"
        onClick={onClickResults}
      >
        <FontAwesomeIcon icon={faEquals} size="2x" />
        <Output dimmed={result === "Result" || wasInputChanged}>
          {result}
        </Output>
      </button>
    </div>
  );
}
