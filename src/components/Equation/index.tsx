import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faEquals, faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ComponentPropsWithoutRef, Ref } from "react";
import { useCallback, useImperativeHandle, useMemo, useState } from "react";

import Unit from "src/components/Equation/Unit/Unit";
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
import { cn } from "src/utils/styles";
import { SortableItem } from "../Sortable";
import CopyButton from "./CopyButton";
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
      setExpression,
    },
  };
}

function Equation({
  input,
  actionButtons,
  ref,
}: {
  ref?: Ref<{ cleanupExpression: () => void }>;
  input: Expression;
  actionButtons: ReturnType<typeof ActionButton>;
}) {
  const {
    state: { expression, resultText },
    actions: {
      cleanupExpression,
      calculateResults,
      deleteUnit,
      insertExpression,
      updateExpression,
      setExpression,
    },
  } = useEquation(input);
  const [wasInputChanged, setWasInputChanged] = useState(false);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      cleanupExpression,
    }),
    [cleanupExpression],
  );

  const handleClickResults = () => {
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor),
  );

  const expressionIndices = useMemo(() => {
    const indices = expression.map(({ id }) => id);
    return indices;
  }, [expression]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return;

      if (active.id !== over.id) {
        setExpression((items) => {
          const oldIndex = expressionIndices.indexOf(String(active.id));
          const newIndex = expressionIndices.indexOf(String(over.id));

          return arrayMove(items, oldIndex, newIndex);
        });
      }
    },
    [expressionIndices, setExpression],
  );

  return (
    <div className="group/equation flex size-max items-stretch justify-center gap-2 rounded-lg p-2 focus-within:bg-slate-800 focus-within:shadow-lg focus-within:outline focus-within:outline-slate-700 hover:bg-slate-800 hover:shadow-lg">
      <div className="invisible flex items-center text-slate-600 group-hover/equation:visible">
        <FontAwesomeIcon icon={faGripVertical} />
      </div>

      <div className="flex gap-0.5">
        <Inserter
          onClick={({ currentTarget }) => insertionHandler(currentTarget, 0)}
        />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={expression}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex w-full items-center justify-center gap-0.5">
              {expression.map((ratio, index) => {
                return (
                  <SortableItem
                    className="flex h-full w-max gap-0.5"
                    key={ratio.id}
                    id={ratio.id}
                  >
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
                  </SortableItem>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
        <button
          className="-m-2 cursor-pointer p-2 hover:bg-slate-700"
          type="button"
          onClick={handleClickResults}
        >
          <FontAwesomeIcon icon={faEquals} />
        </button>
        <div
          className="group flex max-w-xs min-w-max items-center justify-center rounded-lg overflow-ellipsis"
          onClick={handleClickResults}
        >
          <div
            className={cn(
              "min-w-24 rounded-lg p-2 text-center text-white hover:bg-slate-700",
              {
                "text-gray-500 italic":
                  resultText === "Result" || wasInputChanged,
              },
            )}
          >
            {resultText}
          </div>

          <CopyButton
            className="p-2 opacity-0 group-hover:opacity-100"
            content={resultText}
            disabled={resultText === "Result" || wasInputChanged}
          />
        </div>
      </div>

      <div className="invisible flex h-full flex-col pl-1 text-slate-600 group-hover/equation:visible">
        {actionButtons}
      </div>
    </div>
  );
}

const actionButtonStyles = {
  blue: "hover:text-blue-400 active:text-blue-500",
  red: "hover:text-red-400 active:text-red-500",
};

export function ActionButton({
  icon,
  mode,
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<"button">, "children"> & {
  mode: keyof typeof actionButtonStyles;
  icon: IconDefinition;
}) {
  return (
    <button
      className={cn(`${actionButtonStyles[mode]}`, className)}
      type="button"
      {...props}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}

type EquationComponent = typeof Equation & {
  ActionButton: typeof ActionButton;
};

(Equation as EquationComponent).ActionButton = ActionButton;

const EquationWithActionButton = Equation as EquationComponent;
export default EquationWithActionButton;
