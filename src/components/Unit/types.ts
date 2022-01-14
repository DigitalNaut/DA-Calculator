export type ISubunit = {
  input: string | [number, string?];
};

export type IUnit = {
  input: [ISubunit['input'], ISubunit['input']?];
};
