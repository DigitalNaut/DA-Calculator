import { parseInput, stringifyQuantity } from "./input-parser";

suite("expects to parse text into a quantity", () => {
  it("expects to parse an empty string", () => {
    expect(parseInput("")).toBe(undefined);
  });

  it("expects to parse a factor integer", () => {
    expect(parseInput("60")).toEqual({
      factor: 60,
    });
    expect(parseInput("-32")).toEqual({
      factor: -32,
    });
  });

  it("expects to parse a factor float", () => {
    expect(parseInput("18.125")?.factor).toBe(18.125);
  });

  it("expects to parse a label", () => {
    expect(parseInput("m")).toEqual({
      factor: 1,
      labels: ["m"],
    });
  });

  it("expects to parse a percentage", () => {
    expect(parseInput("50%")).toEqual({
      factor: 0.5,
    });

    expect(parseInput("-50%")).toEqual({
      factor: -0.5,
    });
  });

  it("expects to parse a factor and label", () => {
    expect(parseInput("12 roads")).toEqual({
      factor: 12,
      labels: ["roads"],
    });

    expect(parseInput("99.5 km")).toEqual({
      factor: 99.5,
      labels: ["km"],
    });

    expect(parseInput("10% cake")).toEqual({
      factor: 0.1,
      labels: ["cake"],
    });
  });

  it("expects to parse an exponential label", () => {
    expect(parseInput("m^3")).toEqual({
      factor: 1,
      labels: ["m", "m", "m"],
    });
  });

  it("expects an identity for invalid input", () => {
    expect(parseInput("99invalid")).toEqual({
      factor: 1,
    });
  });
});

suite("expects to parse a quantity", () => {
  it("expects to stringify undefined", () => {
    expect(stringifyQuantity()).toBe("");
    expect(stringifyQuantity(undefined)).toBe("");
  });

  it("expects to stringify a quantity", () => {
    expect(stringifyQuantity({ factor: 1, labels: ["m"] })).toBe("1 m");
    expect(stringifyQuantity({ factor: 1.0, labels: ["km", "h"] })).toBe(
      "1 km h",
    );
  });
});
