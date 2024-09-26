import { useSortable } from "@dnd-kit/sortable";
import type { CSSProperties, PropsWithChildren } from "react";

export function SortableItem({
  id,
  children,
  className,
}: PropsWithChildren<{ id: string; className?: string }>) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: CSSProperties = {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
    transition,
  };

  return (
    <div
      className={className}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}
