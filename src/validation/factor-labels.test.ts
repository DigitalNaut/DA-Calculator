import {
  factorNeedle,
  labelNeedle,
  labelExponentNeedle,
} from "./factor-labels";

const match = (input: string, needle: RegExp) =>
  Array.from(input?.match(needle) ?? []);

it("expects a valid factor", () => {
  expect(match("60", factorNeedle)).toEqual(["60"]);
  expect(match("60.0", factorNeedle)).toEqual(["60.0"]);
  expect(match("3 bus", factorNeedle)).toEqual(["3"]);
  expect(match("3.0 bus", factorNeedle)).toEqual(["3.0"]);
});

it("expects a valid label", () => {
  expect(match("m", labelNeedle)).toEqual(["m"]);
  expect(match("grapes", labelNeedle)).toEqual(["grapes"]);
  expect(match("m^2", labelNeedle)).toEqual(["m^2"]);
  expect(match("m*n", labelNeedle)).toEqual(["m*n"]);
  expect(match("foo-bar", labelNeedle)).toEqual(["foo-bar"]);
  expect(match("foo bar", labelNeedle)).toEqual(["foo", "bar"]);
  expect(match("3 foo bar#2", labelNeedle)).toEqual(["foo", "bar#2"]);
  expect(match("3.0 foo bar#2", labelNeedle)).toEqual(["foo", "bar#2"]);
  expect(match("foo 3bar baz#2", labelNeedle)).toEqual(["foo", "baz#2"]);

  expect(match("m$3", labelExponentNeedle)).not.toEqual(["m$3"]);
  expect(match("m%3", labelExponentNeedle)).not.toEqual(["m%3"]);
  expect(match("m@3", labelExponentNeedle)).not.toEqual(["m@3"]);
  expect(match("m!3", labelExponentNeedle)).not.toEqual(["m!3"]);
  expect(match("m&3", labelExponentNeedle)).not.toEqual(["m&3"]);
});

it("expects a valid exponent", () => {
  expect(match("m^3", labelExponentNeedle)).toEqual(["m^3", "m", "3"]);
});
