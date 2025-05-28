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
import type {
  ComponentPropsWithoutRef,
  FocusEventHandler,
  HTMLAttributes,
  SetStateAction,
} from "react";
import {
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import Unit from "src/components/Equation/Unit";
import {
  calculateResults,
  flipUnit,
  insertRatio,
  quantityIsTrivial,
  removeRatio,
  simplifyExpression,
  stringifyExpression,
  stringifyRatio,
  updateRatio,
} from "src/logic/expressions";
import type { BaseRatio, Expression } from "src/types/expressions";
import { cn } from "src/utils/styles";
import { SortableItem } from "../Sortable";
import CopyButton from "./CopyButton";
import Inserter from "./Inserter";
import Period from "./Period";
import type { EquationProps, InputChangeHandler } from "./types";

function useEquation({
  input,
  setInput,
  onExpressionChange,
}: {
  input: Expression;
  setInput: React.Dispatch<SetStateAction<Expression>>;
  onExpressionChange?: (expression: Expression) => void;
}) {
  const [results, setResults] = useState<BaseRatio | null>(null);

  /**
   * Keep track of whether the next item needs a period
   */
  const metadata = useMemo<Record<string, { needsPeriod: boolean }>>(
    () =>
      input.reduce((prev, current, index) => {
        const isNotLastItem = index < input.length - 1;

        if (!isNotLastItem) return prev;

        const currentHasTrivialRatio = quantityIsTrivial(current.denominator);
        const nextHasTrivialRatio = quantityIsTrivial(
          input[index + 1]?.denominator,
        );

        return {
          ...prev,
          [current.id]: {
            needsPeriod: currentHasTrivialRatio && nextHasTrivialRatio,
          },
        };
      }, {}),
    [input],
  );

  const updateResults = useCallback(
    () => setResults(calculateResults(input)),
    [input],
  );

  const cleanupExpression = () => {
    setInput(simplifyExpression(input));
  };

  const deleteUnit = (index: number) => {
    if (input.length === 0) return;

    const modifiedExpression = removeRatio(input, index);
    setInput(modifiedExpression);

    return input.length > modifiedExpression.length;
  };

  const setExpressionTerm: InputChangeHandler = (
    index,
    position,
    userInput,
  ) => {
    setInput((prevExpression) =>
      updateRatio(prevExpression, index, position, userInput),
    );
  };

  const insertExpression = (index: number) => {
    setInput((prevExpression) => insertRatio(prevExpression, index));
  };

  const result = useMemo(
    () => (results ? stringifyRatio(results) : null),
    [results],
  );

  // Used to focus an input when a unit is added
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  const handleClickResults = () => {
    // Clean up
    cleanupExpression();

    // Update data
    updateResults();
  };

  const handleClearFocusIndex = () => setFocusIndex(null);

  const handleInsertion = (
    currentTarget: EventTarget & HTMLButtonElement,
    index: number,
  ) => {
    insertExpression(index);
    setFocusIndex(index);
    currentTarget.blur();
  };

  const handleDeleteUnit = (index: number) => {
    deleteUnit(index);
  };

  const handleInvertUnit = (index: number) => {
    setInput(flipUnit(input, index));
  };

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return;

      if (active.id !== over.id) {
        setInput((items) => {
          const expressionIndices = items.map((item) => item.id);
          const oldIndex = expressionIndices.indexOf(String(active.id));
          const newIndex = expressionIndices.indexOf(String(over.id));

          if (oldIndex === -1 || newIndex === -1) return items;

          return arrayMove(items, oldIndex, newIndex);
        });
      }
    },
    [setInput],
  );

  useEffect(
    /**
     * Calculate results when expression changes.
     * Emits a change event.
     */
    function updateResultsOnChange() {
      updateResults();
      onExpressionChange?.(input);
    },
    [input, updateResults, onExpressionChange],
  );

  return {
    state: { metadata, result },
    actions: { cleanupExpression, focusIndex },
    handlers: {
      handleClickResults,
      handleClearFocusIndex,
      handleInsertion,
      handleDeleteUnit,
      handleChangeInput: setExpressionTerm,
      handleDragEnd,
      handleInvertUnit,
    },
  };
}

function EquationInternal({
  ref,
  children,
  input,
  setInput,
  onElementFocus,
  onElementBlur,
  onExpressionChange,
}: EquationProps) {
  const {
    state: { metadata, result },
    actions: { cleanupExpression, focusIndex },
    handlers: {
      handleClickResults,
      handleClearFocusIndex,
      handleInsertion,
      handleDeleteUnit,
      handleChangeInput,
      handleDragEnd,
    },
  } = useEquation({ input, setInput, onExpressionChange });

  useImperativeHandle(
    ref,
    () => ({
      cleanupExpression,
    }),
    [cleanupExpression],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor),
  );

  const [hasFocus, setHasFocus] = useState(false);

  const handleUnitFocus: FocusEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      handleClearFocusIndex();
      onElementFocus?.(event);
      setHasFocus(true);
    },
    [handleClearFocusIndex, onElementFocus],
  );

  const handleUnitBlur: FocusEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      onElementBlur?.(event);
      setHasFocus(false);
    },
    [onElementBlur],
  );

  const stringifiedExpression = useMemo(
    () => stringifyExpression(input),
    [input],
  );

  const deleteUnitHandlers = useMemo(
    () => input.map((_, index) => () => handleDeleteUnit(index)),
    [handleDeleteUnit, input],
  );

  return (
    <div className="group/equation flex size-max items-stretch justify-center gap-2 rounded-lg p-2 focus-within:bg-slate-800 focus-within:shadow-lg focus-within:outline focus-within:outline-slate-700 hover:bg-slate-800 hover:shadow-lg">
      <div
        className={cn("invisible flex items-center text-slate-600", {
          "group-hover/equation:visible": !hasFocus,
        })}
      >
        {<FontAwesomeIcon icon={faGripVertical} />}
      </div>

      <div className="flex gap-0.5">
        <Inserter
          onClick={({ currentTarget }) => handleInsertion(currentTarget, 0)}
        />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={input}
            strategy={horizontalListSortingStrategy}
            disabled={hasFocus}
          >
            <div className="group/expression flex w-full items-center justify-center gap-0.5">
              {input.map((ratio, index) => (
                <SortableItem
                  className="flex h-full w-max gap-0.5"
                  key={ratio.id}
                  id={ratio.id}
                  tabIndex={-1}
                >
                  <Unit
                    input={ratio}
                    onChange={handleChangeInput}
                    index={index}
                    onDeleteUnit={deleteUnitHandlers[index]}
                    isFocused={focusIndex === index}
                    onFocused={handleUnitFocus}
                    onBlurred={handleUnitBlur}
                  />
                  <Period
                    style={{
                      visibility: metadata[ratio.id]?.needsPeriod
                        ? "visible"
                        : "hidden",
                    }}
                  />
                  <Inserter
                    onClick={({ currentTarget }) =>
                      handleInsertion(currentTarget, index + 1)
                    }
                  />
                </SortableItem>
              ))}
              <CopyButton
                className="p-2 opacity-0 group-focus-within/expression:opacity-50 group-hover/expression:opacity-50"
                content={stringifiedExpression}
              />
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
            autoFocus
            className={cn(
              "min-w-24 rounded-lg p-2 text-center text-white hover:bg-slate-700",
              {
                "text-gray-500 italic": !result,
              },
            )}
          >
            <input
              readOnly
              onFocus={onElementFocus}
              onBlur={onElementBlur}
              value={result || ""}
              size={result?.length || 1}
            />
          </div>

          <CopyButton
            className="p-2 opacity-0 group-focus-within:opacity-50 group-hover:opacity-50"
            content={result || ""}
            disabled={!result}
          />
        </div>
      </div>

      <div className="invisible flex h-full flex-col pl-1 text-slate-600 group-focus-within/equation:visible group-hover/equation:visible">
        {children}
      </div>
    </div>
  );
}

const actionButtonStyles = {
  blue: "hover:text-blue-400 active:text-blue-500",
  red: "hover:text-red-400 active:text-red-500",
};

function ActionButton({
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

function StringOutput({
  expression,
  className,
  ...props
}: HTMLAttributes<HTMLTextAreaElement> & {
  expression: Expression;
}) {
  const elementRef = useRef<HTMLTextAreaElement>(null);
  const [formatOutput, setFormatOutput] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const stringifiedExpression = useMemo(() => {
    setError(null);

    try {
      return JSON.stringify(
        expression.map(({ numerator, denominator }) => ({
          numerator,
          denominator,
        })),
        null,
        formatOutput ? 2 : undefined,
      );
    } catch (error) {
      setError(
        error instanceof Error ? `Error: ${error.message}` : "Unknown error",
      );
      return null;
    }
  }, [expression, formatOutput]);

  return (
    <details className="w-max max-w-sm text-sm whitespace-pre-wrap">
      <summary className="w-full cursor-pointer">JSON</summary>
      <div className="flex flex-col gap-1">
        <textarea
          readOnly
          ref={elementRef}
          className={cn(
            "min-h-10 max-w-full min-w-min resize-none overflow-hidden rounded-lg bg-slate-800 p-2 text-gray-400 focus-within:resize focus-within:overflow-y-auto",
            {
              "text-red-400": error,
            },
            className,
          )}
          value={stringifiedExpression ?? error ?? "Loading..."}
          {...props}
        />
        <div className="flex justify-end">
          <button
            type="button"
            className={cn(
              formatOutput ? "bg-slate-600" : "bg-slate-700",
              "rounded-md p-1 hover:bg-blend-lighten",
            )}
            onClick={() => setFormatOutput(!formatOutput)}
          >
            Format
          </button>
        </div>
      </div>
    </details>
  );
}

const Equation = Object.assign(memo(EquationInternal), {
  ActionButton,
  StringOutput,
});

export default Equation;
