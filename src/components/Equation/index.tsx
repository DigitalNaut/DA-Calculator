import { faEquals } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";

import {
  simplifyExpression,
  insertRatio,
  removeOverlap,
  removeRatio,
  updateRatio,
} from "src/logic/equation-wrangler";
import { BaseRatio, Expression, QuantityPosition } from "src/types/expressions";
import Output from "src/components/Equation/Output";
import { Unit } from "src/components/Equation/Unit";

import type { InputChangeHandler } from "./types";
import Inserter from "./Separator";

export default function Equation({ input }: { input: Expression }) {
  const [expression, setExpression] = useState(input);
  const [results, setResults] = useState<BaseRatio | null>(null);
  const [wasInputChanged, setWasInputChanged] = useState(false);

  const multiplyFactors = (
    expression: Expression,
    subunit: QuantityPosition,
  ) => {
    const reducedExpression = expression.reduce(
      (previousExpression, currentExpression) => {
        const factor = currentExpression[subunit]?.factor ?? 1;

        return previousExpression * factor;
      },
      1,
    );

    return reducedExpression;
  };

  const reduceLabels = (
    expression: Expression,
    quantityPosition: QuantityPosition,
  ) => {
    const reducedExpression = expression.reduce<string[]>(
      (prevTerms, currentTerm) => {
        const labels = currentTerm[quantityPosition]?.labels;

        if (!labels) return prevTerms;

        return prevTerms.concat(labels);
      },
      [],
    );

    return reducedExpression;
  };

  const onClickResults = () => {
    // Update data
    setResults({
      numerator: {
        factor: multiplyFactors(expression, "numerator"),
        labels: reduceLabels(expression, "numerator"),
      },
      denominator: {
        factor: multiplyFactors(expression, "denominator"),
        labels: reduceLabels(expression, "denominator"),
      },
    });

    // Clean up
    setExpression(simplifyExpression(expression));

    // Set flags
    setWasInputChanged(false);
  };

  const resultText = useMemo(() => {
    if (!results) return "Result";

    const resultFactor = `${(
      results.numerator.factor / (results.denominator?.factor || 1)
    )
      .toFixed(2)
      .replace(/\.0+$/, "")}`;

    const resultLabels = removeOverlap(
      results.numerator.labels || [],
      results.denominator?.labels || [],
    );

    return `${resultFactor} ${resultLabels[0].join(" • ")} ${
      resultLabels[1].length > 0 ? "/" : ""
    } ${resultLabels[1].join(" • ")}`;
  }, [results]);

  const updateExpression: InputChangeHandler = (
    index,
    termPosition,
    userInput,
  ) => {
    setExpression((prevExpression) =>
      updateRatio(prevExpression, index, termPosition, userInput),
    );

    setWasInputChanged(true);
  };

  const insertExpression = (index: number) => {
    setExpression((prevExpression) => insertRatio(prevExpression, index));
  };

  const deleteUnit = (index: number) => {
    if (expression.length === 0) return;

    const modifiedExpression = removeRatio(expression, index);
    setExpression(modifiedExpression);

    setWasInputChanged(expression.length > modifiedExpression.length);
  };

  return (
    <div className="m-1 flex h-full w-max items-center justify-center rounded-md bg-gray-800 shadow-md">
      <Inserter
        onClick={(e) => {
          insertExpression(0);
          e.currentTarget.blur();
        }}
      />
      {expression.map((ratio, index) => {
        return (
          <div
            className="flex h-full items-center justify-center"
            key={ratio.id}
          >
            <Unit
              inputRatio={ratio}
              onChangeInput={updateExpression}
              index={index}
              onDeleteUnit={() => deleteUnit(index)}
            />
            <Inserter
              onClick={({ currentTarget }) => {
                insertExpression(index + 1);
                currentTarget.blur();
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
        <Output dimmed={resultText === "Result" || wasInputChanged}>
          {resultText}
        </Output>
      </button>
    </div>
  );
}
