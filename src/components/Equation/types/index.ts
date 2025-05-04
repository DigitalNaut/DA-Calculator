import type { FocusEventHandler } from "react";
import type { Quantity, QuantityPosition, Ratio } from "src/types/expressions";

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
  };

export type EquationHandle = {
  expressionToString: () => string;
  cleanupExpression: () => void;
};

export type SubunitProps = InputHandlerProps &
  Partial<Focusable> & {
    inputQuantity: Quantity;
    quantityPosition: QuantityPosition;
  };
