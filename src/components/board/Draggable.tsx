import { useDraggable } from "@dnd-kit/core";
import type { Coordinates } from "@dnd-kit/utilities";
import { CSS } from "@dnd-kit/utilities";
import type { PropsWithChildren } from "react";

export default function Draggable({
  children,
  id,
  coordinates,
}: PropsWithChildren<{ id: string; coordinates: Coordinates }>) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className="absolute flex size-max"
      style={{
        top: coordinates.y,
        left: coordinates.x,
        transform: CSS.Translate.toString(transform),
      }}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}
