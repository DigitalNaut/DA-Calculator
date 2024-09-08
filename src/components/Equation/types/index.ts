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

export type UnitProps = InputHandlerProps & {
  inputRatio: Ratio;
  onDeleteUnit(): void;
};

export type SubunitProps = InputHandlerProps & {
  inputQuantity: Quantity;
  quantityPosition: QuantityPosition;
  display?: true;
};
