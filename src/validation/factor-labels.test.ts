import { factorLabelNeedle, factorNeedle, labelNeedle } from "./factor-labels";

const factorLabelTest = (needle: RegExp) => (input: string) => {
  const [, factor, labels] = input.match(needle) || [];
  return [factor, labels];
};

suite("separates factor and labels in the input", () => {
  const test = factorLabelTest(factorLabelNeedle);

  it("handles a single factor", () => {
    expect(test("60")).toEqual(["60", undefined]);
  });
  it("handles a factor with a label", () => {
    expect(test("3 apples")).toEqual(["3", "apples"]);
  });
  it("handles a factor with multiple labels", () => {
    expect(test("8 area*@ m^3 quick リンゴ 🏠")).toEqual([
      "8",
      "area*@ m^3 quick リンゴ 🏠",
    ]);
  });
});

const factorTest = (needle: RegExp) => (input: string) => {
  const [, number, percent] = input.match(needle) || [];
  return [number, percent];
};

suite("expects a valid number factor", () => {
  const test = factorTest(factorNeedle);

  it("handles whole numbers", () => {
    expect(test("60")).toEqual(["60", ""]);
    expect(test("-60")).toEqual(["-60", ""]);
  });
  it("handles decimal numbers", () => {
    expect(test("60.0")).toEqual(["60.0", ""]);
    expect(test("-60.0")).toEqual(["-60.0", ""]);
    expect(test("19.501")).toEqual(["19.501", ""]);
    expect(test("-19.501")).toEqual(["-19.501", ""]);
  });
  it("ignores non-numeric characters", () => {
    expect(test("3bus")).toEqual([undefined, undefined]);
    expect(test("3.0bus")).toEqual([undefined, undefined]);
  });
  it("handles whole percentages", () => {
    expect(test("10%")).toEqual(["10", "%"]);
    expect(test("-10%")).toEqual(["-10", "%"]);
  });
  it("handles decimal percentages", () => {
    expect(test("16.5%")).toEqual(["16.5", "%"]);
    expect(test("-16.5%")).toEqual(["-16.5", "%"]);
    expect(test("0.5%")).toEqual(["0.5", "%"]);
    expect(test("-0.5%")).toEqual(["-0.5", "%"]);
    expect(test("1.519%")).toEqual(["1.519", "%"]);
    expect(test("-1.519%")).toEqual(["-1.519", "%"]);
  });
});

const labelTest = (needle: RegExp) => (input: string) => {
  const [, label, exponent] = input.match(needle) || [];
  return [label, exponent];
};

suite("expects a valid label", () => {
  const test = labelTest(labelNeedle);

  it("handles simple labels in any case", () => {
    expect(test("m")).toEqual(["m", undefined]);
    expect(test("M")).toEqual(["M", undefined]);
    expect(test("grapes")).toEqual(["grapes", undefined]);
    expect(test("GRAPE")).toEqual(["GRAPE", undefined]);
    expect(test("Artichoke")).toEqual(["Artichoke", undefined]);
    expect(test("gOdZiLla")).toEqual(["gOdZiLla", undefined]);
  });
  it("handles labels with exponents", () => {
    expect(test("m^2")).toEqual(["m", "2"]);
  });
  it("handles labels with non-boundary special characters", () => {
    expect(test("foo#2")).toEqual(["foo#2", undefined]);
    expect(test("foo-2")).toEqual(["foo-2", undefined]);
    expect(test("foo-bar")).toEqual(["foo-bar", undefined]);
  });
  it("handles labels with special characters", () => {
    expect(test("g_-#~!@")).toEqual(["g_-#~!@", undefined]);
  });
  it("handles labels with numbers after the first character", () => {
    expect(test("a3")).toEqual(["a3", undefined]);
    expect(test("Z8")).toEqual(["Z8", undefined]);
    expect(test("caravan6")).toEqual(["caravan6", undefined]);
    expect(test("Mozart3")).toEqual(["Mozart3", undefined]);
    expect(test("m3n")).toEqual(["m3n", undefined]);
  });
  it("handles simple emojis", () => {
    expect(test("🍎")).toEqual(["🍎", undefined]);
    expect(test("😎^2")).toEqual(["😎", "2"]);
  });
  it("handles compound emojis & emoji sequences", () => {
    expect(test("👩🏿")).toEqual(["👩🏿", undefined]);
    expect(test("👨‍👨‍👦‍👦")).toEqual(["👨‍👨‍👦‍👦", undefined]);
    expect(test("👨‍👨‍👦‍👦^3")).toEqual(["👨‍👨‍👦‍👦", "3"]);
  });

  const noMatch = [undefined, undefined];

  it("fails on numbers before the first character", () => {
    expect(test("3a")).toEqual(noMatch);
    expect(test("3Z")).toEqual(noMatch);
    expect(test("3caravan")).toEqual(noMatch);
    expect(test("3Mozart")).toEqual(noMatch);
    expect(test("#")).toEqual(noMatch);
    expect(test("#Mozart")).toEqual(noMatch);
    expect(test("*")).toEqual(noMatch);
    expect(test("*^2")).toEqual(noMatch);
  });
});

const labelExponentTest = (needle: RegExp) => (input: string) => {
  const [, label, exponent] = input.match(needle) || [];
  return [label, exponent];
};

it("expects a valid exponent", () => {
  const test = labelExponentTest(labelNeedle);

  expect(test("m^3")).toEqual(["m", "3"]);
  expect(test("dog^30")).toEqual(["dog", "30"]);

  const noMatch = [undefined, undefined];

  expect(test("m^-3")).toEqual(noMatch);
  expect(test("m$3")).toEqual(noMatch);
  expect(test("m%3")).toEqual(noMatch);
  expect(test("m&3")).toEqual(noMatch);
});
