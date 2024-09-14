import type { QuantityPosition, Ratio, Quantity } from "src/types/expressions";

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
  onFocused(): void;
};

export type UnitProps = InputHandlerProps &
  Focusable & {
    inputRatio: Ratio;
    onDeleteUnit(): void;
  };

export type SubunitProps = InputHandlerProps &
  Partial<Focusable> & {
    inputQuantity: Quantity;
    quantityPosition: QuantityPosition;
  };
