import type { FocusEventHandler, ReactNode, Ref, RefObject } from "react";
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
  onChangeInput: InputChangeHandler;
};

type Focusable = {
  isFocused: boolean;
  onFocused?: FocusEventHandler<HTMLDivElement>;
  onBlurred?: FocusEventHandler<HTMLDivElement>;
};

export type UnitProps = InputHandlerProps &
  Focusable & {
    inputRatio: Ratio;
    onDeleteUnit(): void;
    onFlipUnit(): void;
  };

export type EquationHandle = {
  cleanupExpression: () => void;
};

export type SubunitHandle = {
  focus: () => void;
};

export type SubunitProps = InputHandlerProps &
  Partial<Focusable> & {
    inputQuantity: Quantity;
    quantityPosition: QuantityPosition;
    ref: RefObject<SubunitHandle | null>;
  };

export type EquationProps = {
  ref?: Ref<EquationHandle>;
  input: Expression;
  actionButtons: ReactNode;
  onElementFocus?: FocusEventHandler<HTMLDivElement>;
  onElementBlur?: FocusEventHandler<HTMLDivElement>;
  onExpressionChange?: (expression: Expression) => void;
};
