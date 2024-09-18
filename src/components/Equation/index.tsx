import {
  faBroom,
  faClone,
  faEquals,
  faGripVertical,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useMemo, useState } from "react";

import Output from "src/components/Equation/Output";
import { Unit } from "src/components/Equation/Unit";
import {
  cancelOutLabels,
  insertRatio,
  removeRatio,
  simplifyExpression,
  stringifyLabels,
  updateRatio,
} from "src/logic/expression-wrangler";
import type {
  BaseRatio,
  Expression,
  LabelCount,
  QuantityPosition,
} from "src/types/expressions";
import Inserter from "./Inserter";
import type { InputChangeHandler } from "./types";

function useEquation(input: Expression) {
  const [expression, setExpression] = useState(input);
  const [results, setResults] = useState<BaseRatio | null>(null);

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

  const cleanupExpression = () => {
    setExpression(simplifyExpression(expression));
  };

  const calculateResults = () =>
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

  const deleteUnit = (index: number) => {
    if (expression.length === 0) return;

    const modifiedExpression = removeRatio(expression, index);
    setExpression(modifiedExpression);

    return expression.length > modifiedExpression.length;
  };

  const updateExpression: InputChangeHandler = (
    index,
    termPosition,
    userInput,
  ) => {
    setExpression((prevExpression) =>
      updateRatio(prevExpression, index, termPosition, userInput),
    );
  };

  const insertExpression = (index: number) => {
    setExpression((prevExpression) => insertRatio(prevExpression, index));
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

  return {
    state: { expression, resultText },
    actions: {
      cleanupExpression,
      calculateResults,
      deleteUnit,
      updateExpression,
      insertExpression,
    },
  };
}

export default function Equation({
  input,
  onDelete,
  onClone,
}: {
  input: Expression;
  onDelete?: () => void;
  onClone?: () => void;
}) {
  const {
    state: { expression, resultText },
    actions: {
      cleanupExpression,
      calculateResults,
      deleteUnit,
      insertExpression,
      updateExpression,
    },
  } = useEquation(input);
  const [wasInputChanged, setWasInputChanged] = useState(false);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  const onClickResults = () => {
    // Clean up
    cleanupExpression();

    // Update data
    calculateResults();

    // Reset flags
    setWasInputChanged(false);
  };

  const clearFocusIndex = () => setFocusIndex(null);

  const insertionHandler = (
    currentTarget: EventTarget & HTMLButtonElement,
    index: number,
  ) => {
    insertExpression(index);
    setFocusIndex(index);
    currentTarget.blur();
  };

  const deleteUnitHandler = (index: number) => {
    if (deleteUnit(index)) setWasInputChanged(true);
  };

  const changeInputHandler: InputChangeHandler = (...args) => {
    updateExpression(...args);
    setWasInputChanged(true);
  };

  return (
    <div className="group/equation flex size-max items-stretch justify-center gap-2 rounded-lg p-2 focus-within:bg-slate-800 focus-within:shadow-lg focus-within:outline focus-within:outline-1 focus-within:outline-slate-700 hover:bg-slate-800 hover:shadow-lg">
      <div className="invisible flex items-center text-slate-600 group-hover/equation:visible">
        <FontAwesomeIcon icon={faGripVertical} />
      </div>

      <div className="flex">
        <Inserter
          onClick={({ currentTarget }) => insertionHandler(currentTarget, 0)}
        />
        {expression.map((ratio, index) => {
          return (
            <Fragment key={ratio.id}>
              <Unit
                inputRatio={ratio}
                onChangeInput={changeInputHandler}
                index={index}
                onDeleteUnit={() => deleteUnitHandler(index)}
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

      <div className="invisible flex h-full flex-col pl-1 text-slate-600 group-hover/equation:visible">
        <button
          className="hover:text-blue-400 active:text-blue-500"
          type="button"
          onClick={onClone}
        >
          <FontAwesomeIcon icon={faClone} />
        </button>
        <button
          className="hover:text-blue-400 active:text-blue-500"
          type="button"
          onClick={cleanupExpression}
        >
          <FontAwesomeIcon icon={faBroom} />
        </button>
        <button
          className="hover:text-red-400 active:text-red-500"
          type="button"
          onClick={onDelete}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}
