import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import type { Coordinates } from "@dnd-kit/utilities";
import { faBroom, faClone, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { MouseEventHandler } from "react";
import { useCallback, useMemo, useRef, useState } from "react";

import Draggable from "src/components/Draggable";
import Equation from "src/components/Equation";
import {
  addExpression,
  modifyExpression,
  removeExpression,
} from "src/features/expressions/expressionRecordsSlice";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import type { Expression } from "src/types/expressions";
import type { EquationHandle } from "../Equation/types";

const NEW_EQUATION_HALF_WIDTH = 107.5; // Manually measured
const NEW_EQUATION_HALF_HEIGHT = 44;

export default function Board() {
  const { expressions } = useAppSelector((state) => state.expressionRecords);
  const dispatch = useAppDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor),
  );
  const equationsMapRef = useRef(new Map<string, EquationHandle>());

  const doubleClickBoardHandler: MouseEventHandler<HTMLDivElement> =
    useCallback(
      (event) => {
        const { target, currentTarget } = event;
        if (target !== currentTarget) return;

        const x =
          currentTarget.scrollLeft +
          event.clientX -
          currentTarget.offsetLeft -
          NEW_EQUATION_HALF_WIDTH;

        const y =
          currentTarget.scrollTop +
          event.clientY -
          currentTarget.offsetTop -
          NEW_EQUATION_HALF_HEIGHT;

        dispatch(addExpression({ coordinates: { x, y } }));
      },
      [dispatch],
    );

  const dragEndHandler = useCallback(
    ({ active, delta }: DragEndEvent) =>
      dispatch(
        modifyExpression({
          key: String(active.id),
          callback: ({ coordinates: { x, y } }) => ({
            coordinates: {
              x: x + delta.x,
              y: y + delta.y,
            },
          }),
        }),
      ),
    [dispatch],
  );

  const duplicateEquationHandler = useCallback(
    (expression: Expression, coordinates: Coordinates) =>
      dispatch(
        addExpression({
          expression,
          coordinates: {
            x: coordinates.x,
            y: coordinates.y + NEW_EQUATION_HALF_HEIGHT * 2,
          },
        }),
      ),
    [dispatch],
  );

  const [hasFocus, setHasFocus] = useState(false);

  const equations = useMemo(() => Object.entries(expressions), [expressions]);

  return (
    <article
      className="relative size-full gap-3 overflow-auto rounded-lg bg-gray-900 p-2"
      onDoubleClick={doubleClickBoardHandler}
    >
      <DndContext
        sensors={sensors}
        onDragEnd={dragEndHandler}
        modifiers={[restrictToParentElement]}
      >
        {equations.map(([key, { expression, coordinates }]) => (
          <Draggable
            className="absolute flex size-max"
            key={key}
            id={key}
            style={{ top: coordinates.y, left: coordinates.x }}
            disabled={hasFocus}
          >
            <Equation
              ref={(ref) => {
                if (ref) equationsMapRef.current.set(key, ref);
                else equationsMapRef.current.delete(key);
                return () => {
                  equationsMapRef.current.delete(key);
                };
              }}
              onElementFocus={() => setHasFocus(true)}
              onElementBlur={() => setHasFocus(false)}
              // onExpressionChange={(expression) =>
              // updateExpression(key, (prevExpression) => ({
              //   expression,
              //   coordinates: prevExpression.coordinates,
              // }))
              // }
              input={expression}
              actionButtons={
                <>
                  <Equation.ActionButton
                    mode="blue"
                    icon={faClone}
                    title="Duplicate equation"
                    onClick={() =>
                      duplicateEquationHandler(expression, coordinates)
                    }
                  />
                  <Equation.ActionButton
                    mode="blue"
                    icon={faBroom}
                    title="Remove trivial units"
                    onClick={() =>
                      equationsMapRef.current.get(key)?.cleanupExpression()
                    }
                  />
                  <Equation.ActionButton
                    mode="red"
                    icon={faTrash}
                    title="Delete equation"
                    onClick={() => {
                      dispatch(removeExpression(key));
                      equationsMapRef.current.delete(key);
                    }}
                  />
                </>
              }
            />
          </Draggable>
        ))}
      </DndContext>
    </article>
  );
}
