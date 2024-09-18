import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties, PropsWithChildren } from "react";

export default function Draggable({
  children,
  id,
  style,
  className,
}: PropsWithChildren<{
  id: string;
  className?: string;
  style?: CSSProperties;
}>) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
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
    >
      {children}
    </div>
  );
}
