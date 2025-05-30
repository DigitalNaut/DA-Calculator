import type {
  Dispatch,
  FocusEventHandler,
  ReactNode,
  Ref,
  RefObject,
  SetStateAction,
} from "react";
import type {
  Expression,
  Quantity,
  QuantityPosition,
  Ratio,
} from "src/types/expressions";

export type InputChangeHandler = (
  index: number,
  subunit: QuantityPosition,
  userInput: string,
) => void;

type InputHandlerProps = {
  index: number;
  onChange: InputChangeHandler;
};

type Focusable = {
  isFocused: boolean;
  onFocused?: FocusEventHandler<HTMLDivElement>;
  onBlurred?: FocusEventHandler<HTMLDivElement>;
};

export type UnitProps = InputHandlerProps &
  Focusable & {
    input: Ratio;
    onDeleteUnit(): void;
  };

export type EquationHandle = {
  cleanupExpression: () => void;
};

export type SubunitHandle = {
  focus: () => void;
};

export type SubunitProps = InputHandlerProps &
  Partial<Focusable> & {
    input: Quantity;
    quantityPosition: QuantityPosition;
    ref: RefObject<SubunitHandle | null>;
  };

export type EquationProps = {
  ref?: Ref<EquationHandle>;
  actionButtons: ReactNode;
  input: Expression;
  setInput: Dispatch<SetStateAction<Expression>>;
  onElementFocus?: FocusEventHandler<HTMLDivElement>;
  onElementBlur?: FocusEventHandler<HTMLDivElement>;
  onExpressionChange?: (expression: Expression) => void;
};
