import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { MouseEventHandler } from "react";

import Draggable from "src/components/Draggable";
import Equation from "src/components/Equation";
import useExpressions from "src/hooks/expressions-context/useExpressions";

const NEW_EQUATION_HALF_WIDTH = 107.5; // Manually measured
const NEW_EQUATION_HALF_HEIGHT = 44;

export default function Board() {
  const {
    state: { expressions },
    actions: { removeExpression, addExpression, updateExpression },
  } = useExpressions();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const doubleClickHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target !== e.currentTarget) return;

    const coordinates = {
      x:
        e.currentTarget.scrollLeft +
        e.clientX -
        e.currentTarget.offsetLeft -
        NEW_EQUATION_HALF_WIDTH,
      y:
        e.currentTarget.scrollTop +
        e.clientY -
        e.currentTarget.offsetTop -
        NEW_EQUATION_HALF_HEIGHT,
    };

    addExpression({ coordinates });
  };

  return (
    <div
      className="relative size-full gap-3 overflow-auto rounded-lg bg-gray-900 p-2"
      onDoubleClick={doubleClickHandler}
    >
      <DndContext
        sensors={sensors}
        onDragEnd={({ active, delta }) =>
          updateExpression(String(active.id), ({ coordinates: { x, y } }) => ({
            coordinates: {
              x: x + delta.x,
              y: y + delta.y,
            },
          }))
        }
      >
        {[...expressions].map(([key, { expression, coordinates }]) => (
          <Draggable
            className="absolute flex size-max"
            key={key}
            id={key}
            style={{ top: coordinates.y, left: coordinates.x }}
          >
            <Equation
              input={expression}
              onDelete={() => removeExpression(key)}
              onClone={() => addExpression({ expression, coordinates })}
            />
          </Draggable>
        ))}
      </DndContext>
    </div>
  );
}
