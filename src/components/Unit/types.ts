import { ChangeEvent, ChangeEventHandler, KeyboardEventHandler } from 'react';

type ICustomChangeEventHandler<T = Element> = (
  userInput: string,
  index?: number,
  subunit?: 0 | 1,
) => void;
export type CustomInputChangeHandler = ICustomChangeEventHandler<HTMLInputElement>;

type IInputHandler = {
  index?: number;
  onChangeInput?: CustomInputChangeHandler;
};

export type IUnit = IInputHandler & {
  input: [IInput, IInput?];
};

export type ISubunit = IInputHandler & {
  input: IInput;
  subunit?: 0 | 1;
  display?: true;
};

export type ISimpleInput = string;
export type ICompoundInput = [number, string?];

export type IInput = ISimpleInput | ICompoundInput;
