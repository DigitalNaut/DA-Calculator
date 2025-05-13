import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties, HTMLAttributes } from "react";

export default function Draggable({
  children,
  id,
  style,
  className,
  disabled,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  id: string;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      className={className}
      style={{
        ...style,
        transform: CSS.Translate.toString(transform),
      }}
      {...listeners}
      {...attributes}
      {...rest}
    >
      {children}
    </div>
  );
}
