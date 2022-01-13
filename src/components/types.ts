export type ISubunit = {
  input: [number, string];
};

export type IUnit = {
  input: [ISubunit['input'], ISubunit['input']?];
};

export type IExpression = IUnit['input'][];
