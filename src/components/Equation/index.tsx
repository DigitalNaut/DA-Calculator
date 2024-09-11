import { faEquals } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useMemo, useState } from "react";

import {
  simplifyExpression,
  insertRatio,
  cancelOutUnits,
  removeRatio,
  updateRatio,
} from "src/logic/equation-wrangler";
import { BaseRatio, Expression, QuantityPosition } from "src/types/expressions";
import Output from "src/components/Equation/Output";
import { Unit } from "src/components/Equation/Unit";

import type { InputChangeHandler } from "./types";
import Inserter from "./Inserter";

export default function Equation({ input }: { input: Expression }) {
  const [expression, setExpression] = useState(input);
  const [results, setResults] = useState<BaseRatio | null>(null);
  const [wasInputChanged, setWasInputChanged] = useState(false);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

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

    const [numeratorLabels, denominatorLabels] = cancelOutUnits(
      results.numerator.labels || [],
      results.denominator?.labels || [],
    );

    return `${resultFactor} ${numeratorLabels.join(" • ")} ${
      denominatorLabels.length > 0 ? "/" : ""
    } ${denominatorLabels.join(" • ")}`;
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
    setFocusIndex(index);
  };

  const clearFocusIndex = () => setFocusIndex(null);

  const insertionHandler = (
    currentTarget: EventTarget & HTMLButtonElement,
    index: number,
  ) => {
    insertExpression(index);
    currentTarget.blur();
  };

  const deleteUnit = (index: number) => {
    if (expression.length === 0) return;

    const modifiedExpression = removeRatio(expression, index);
    setExpression(modifiedExpression);

    setWasInputChanged(expression.length > modifiedExpression.length);
  };

  return (
    <div className="flex h-full w-max items-center justify-center rounded-lg bg-slate-800 px-2 py-2 shadow-md">
      <Inserter
        onClick={({ currentTarget }) => insertionHandler(currentTarget, 0)}
      />
      {expression.map((ratio, index) => {
        return (
          <Fragment key={ratio.id}>
            <Unit
              inputRatio={ratio}
              onChangeInput={updateExpression}
              index={index}
              onDeleteUnit={() => deleteUnit(index)}
              isFocused={focusIndex === index}
              onFocused={clearFocusIndex}
            />
            <Inserter
              onClick={({ currentTarget }) =>
                insertionHandler(currentTarget, index + 1)
              }
            />
          </Fragment>
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
