import type { MouseEventHandler } from "react";

import Equation from "src/components/Equation";
import useExpressions from "src/hooks/expressions-context/useExpressions";

export default function Board() {
  const {
    state: { expressions },
    actions: { removeExpression, addExpression },
  } = useExpressions();

  const doubleClickHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target !== e.currentTarget) return;

    addExpression();
  };

  return (
    <div
      className="flex size-full flex-col items-center gap-3 overflow-auto rounded-lg bg-slate-900 p-2"
      onDoubleClick={doubleClickHandler}
    >
      {[...expressions].map(([key, expression]) => (
        <Equation
          key={key}
          input={expression}
          onDelete={() => removeExpression(key)}
          onClone={() => addExpression(expression)}
        />
      ))}
    </div>
  );
}
