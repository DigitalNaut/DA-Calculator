import { faEquals } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useMemo, useState } from "react";

import {
  simplifyExpression,
  insertRatio,
  cancelOutLabels,
  removeRatio,
  updateRatio,
  stringifyLabels,
} from "src/logic/equation-wrangler";
import type {
  BaseRatio,
  Expression,
  LabelCount,
  QuantityPosition,
} from "src/types/expressions";
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

  const compoundLabels = (
    expression: Expression,
    quantityPosition: QuantityPosition,
  ) => {
    const reducedExpression = expression.reduce<LabelCount>(
      (prevTerms, currentTerm) => {
        const labels = currentTerm[quantityPosition]?.labels;

        if (!labels) return prevTerms;

        for (const [label, count] of labels) {
          const prevCount = prevTerms.get(label) || 0;
          prevTerms.set(label, prevCount + count);
        }

        return prevTerms;
      },
      new Map<string, number>(),
    );

    return reducedExpression;
  };

  const onClickResults = () => {
    // Update data
    setResults({
      numerator: {
        factor: multiplyFactors(expression, "numerator"),
        labels: compoundLabels(expression, "numerator"),
      },
      denominator: {
        factor: multiplyFactors(expression, "denominator"),
        labels: compoundLabels(expression, "denominator"),
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

    const resultsLabels = cancelOutLabels(
      results.numerator.labels || new Map(),
      results.denominator?.labels || new Map(),
    );

    const stringifiedLabels = stringifyLabels(resultsLabels);

    return `${resultFactor} ${stringifiedLabels}`;
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
    <div className="group/equation flex h-full w-max items-center justify-center rounded-lg p-2 focus-within:bg-slate-800 focus-within:shadow-lg focus-within:outline focus-within:outline-1 focus-within:outline-slate-700 hover:bg-slate-800 hover:shadow-lg">
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

      <button type="button" onClick={onClickResults}>
        <FontAwesomeIcon icon={faEquals} size="2x" />
      </button>
      <button className="pl-2" type="button" onClick={onClickResults}>
        <Output dimmed={resultText === "Result" || wasInputChanged}>
          {resultText}
        </Output>
      </button>
    </div>
  );
}
