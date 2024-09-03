export type CustomInputChangeHandler = (
  userInput: string,
  index?: number,
  subunit?: 0 | 1
) => void;

type InputHandler = {
  index?: number;
  onChangeInput?: CustomInputChangeHandler;
};

type SimpleInput = string;
export type CompoundInput = [number, string?];

export type Input = SimpleInput | CompoundInput;
export type UnitInput = [Input, Input?];

export type Unit = InputHandler & {
  input: UnitInput;
  onDeleteUnit?(): void;
};

export type Subunit = InputHandler & {
  input: Input;
  subunit?: 0 | 1;
  display?: true;
};
