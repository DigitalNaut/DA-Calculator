import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

/**
 * A zero-width period component to display in an {@link Equation}.
 */
export default function Period({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge("relative h-full w-0", className)} {...rest}>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-slate-500">
        •
      </span>
    </div>
  );
}
