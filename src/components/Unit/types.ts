export type CustomInputChangeHandler = (
  userInput: string,
  index?: number,
  subunit?: 0 | 1
) => void;

type InputHandler = {
  index?: number;
  onChangeInput?: CustomInputChangeHandler;
};

export type Unit = InputHandler & {
  input: [Input, Input?];
  onDeleteUnit?(): void;
};

export type Subunit = InputHandler & {
  input: Input;
  subunit?: 0 | 1;
  display?: true;
};

export type SimpleInput = string;
export type CompoundInput = [number, string?];

export type Input = SimpleInput | CompoundInput;
