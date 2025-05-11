import type { Quantity } from "src/types/expressions";
import { parseInput, stringifyQuantity } from "./input-parser";

suite("expects to parse text into a quantity", () => {
  it("can parse an empty string", () => {
    expect(parseInput("")).toBe(undefined);
  });

  it("can parse a factor integer", () => {
    expect(parseInput("1")).toEqual<Quantity>({
      factor: 1,
    });
    expect(parseInput("0")).toEqual<Quantity>({
      factor: 0,
    });
    expect(parseInput("-0")).toEqual<Quantity>({
      factor: 0,
    });
    expect(parseInput("-0")).toEqual<Quantity>({
      factor: 0,
    });
    expect(parseInput("60")).toEqual<Quantity>({
      factor: 60,
    });
    expect(parseInput("-32")).toEqual<Quantity>({
      factor: -32,
    });
  });

  it("can parse a factor float", () => {
    expect(parseInput("18.125")?.factor).toBe(18.125);
  });

  it("can parse a label", () => {
    expect(parseInput("m")).toEqual<Quantity>({
      factor: 1,
      labels: { m: 1 },
    });
  });

  it("can parse a percentage", () => {
    expect(parseInput("50%")).toEqual<Quantity>({
      factor: 0.5,
    });

    expect(parseInput("-50%")).toEqual<Quantity>({
      factor: -0.5,
    });
  });

  it("can parse a factor and label", () => {
    expect(parseInput("12 roads")).toEqual<Quantity>({
      factor: 12,
      labels: { roads: 1 },
    });

    expect(parseInput("99.5 km")).toEqual<Quantity>({
      factor: 99.5,
      labels: { km: 1 },
    });

    expect(parseInput("10% cake")).toEqual<Quantity>({
      factor: 0.1,
      labels: { cake: 1 },
    });
  });

  it("can parse an exponential label", () => {
    expect(parseInput("m^3")).toEqual<Quantity>({
      factor: 1,
      labels: { m: 3 },
    });
  });

  it("returns identity for invalid input", () => {
    expect(parseInput("99invalid")).toEqual<Quantity>({
      factor: 1,
    });
  });
});

suite("expects to parse a quantity", () => {
  it("can stringify undefined", () => {
    expect(stringifyQuantity()).toBe("");
    expect(stringifyQuantity(undefined)).toBe("");
  });

  it("can stringify a quantity", () => {
    expect(stringifyQuantity({ factor: 1, labels: { m: 1 } })).toBe("1 m");
    expect(
      stringifyQuantity({
        factor: 1.0,
        labels: { km: 1, h: 3 },
      }),
    ).toBe("1 km h^3");
  });
});
