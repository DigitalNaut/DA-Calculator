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
import { useCallback, useRef } from "react";

import Draggable from "src/components/Draggable";
import Equation from "src/components/Equation";
import useExpressions from "src/hooks/expressions-context/useExpressions";
import type { Expression } from "src/types/expressions";

const NEW_EQUATION_HALF_WIDTH = 107.5; // Manually measured
const NEW_EQUATION_HALF_HEIGHT = 44;

export default function Board() {
  const {
    state: { expressions },
    actions: { removeExpression, addExpression, updateExpression },
  } = useExpressions();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor),
  );
  const equationsMapRef = useRef(
    new Map<string, { cleanupExpression: () => void }>(),
  );

  const doubleClickHandler: MouseEventHandler<HTMLDivElement> = useCallback(
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

      addExpression({ coordinates: { x, y } });
    },
    [addExpression],
  );

  const dragEndHandler = useCallback(
    ({ active, delta }: DragEndEvent) =>
      updateExpression(String(active.id), ({ coordinates: { x, y } }) => ({
        coordinates: {
          x: x + delta.x,
          y: y + delta.y,
        },
      })),
    [updateExpression],
  );

  const duplicateEquationHandler = useCallback(
    (expression: Expression, coordinates: Coordinates) =>
      addExpression({
        expression,
        coordinates: {
          x: coordinates.x,
          y: coordinates.y + NEW_EQUATION_HALF_HEIGHT * 2,
        },
      }),
    [addExpression],
  );

  return (
    <div
      className="relative size-full gap-3 overflow-auto rounded-lg bg-gray-900 p-2"
      onDoubleClick={doubleClickHandler}
    >
      <DndContext
        sensors={sensors}
        onDragEnd={dragEndHandler}
        modifiers={[restrictToParentElement]}
      >
        {[...expressions].map(([key, { expression, coordinates }]) => (
          <Draggable
            className="absolute flex size-max"
            key={key}
            id={key}
            style={{ top: coordinates.y, left: coordinates.x }}
          >
            <Equation
              ref={(ref) => {
                if (ref) equationsMapRef.current.set(key, ref);
                else equationsMapRef.current.delete(key);
                return () => {
                  equationsMapRef.current.delete(key);
                };
              }}
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
                      removeExpression(key);
                      equationsMapRef.current.delete(key);
                    }}
                  />
                </>
              }
            />
          </Draggable>
        ))}
      </DndContext>
    </div>
  );
}
