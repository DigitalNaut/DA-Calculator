import { useSortable } from "@dnd-kit/sortable";
import type { CSSProperties, HTMLAttributes } from "react";

type SortableItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string; // Make required for useSortable
  disabled?: boolean;
};

export function SortableItem({
  id,
  children,
  className,
  ...rest
}: SortableItemProps) {
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
      {...rest}
    >
      {children}
    </div>
  );
}
