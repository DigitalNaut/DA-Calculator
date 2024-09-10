import {
  insertRatio,
  isRatioTrivial,
  newExpression,
  newRatio,
  quantityIsTrivial,
  cancelOutUnits,
  removeRatio,
  simplifyExpression,
  updateRatio,
} from "./equation-wrangler";

it("expects to get a new default expression", () => {
  const testExpression = newExpression();
  expect(testExpression).toHaveLength(1);

  expect(testExpression[0].id).toBeTypeOf("string");
  expect(testExpression[0].id.length).toBeGreaterThan(0);
  expect(testExpression[0].numerator).toEqual({ factor: 1, labels: undefined });
  expect(testExpression[0].denominator).toBe(undefined);
});

it("expects to get a new expression from an input object", () => {
  const testExpression = newExpression([
    {
      numerator: { factor: 5, labels: ["foo"] },
      denominator: { factor: 1, labels: ["bar"] },
    },
  ]);

  // Length
  expect(testExpression).toHaveLength(1);

  // ID
  expect(testExpression[0]).toHaveProperty("id");
  expect(testExpression[0].id).toBeTypeOf("string");
  expect(testExpression[0].id.length).toBeGreaterThan(0);

  // Numerator
  expect(testExpression[0].numerator).toEqual({ factor: 5, labels: ["foo"] });

  // Denominator
  expect(testExpression[0].denominator).toEqual({ factor: 1, labels: ["bar"] });
});

suite("detect trivial quantities", () => {
  it("1 is trivial", () => {
    const testQuantity = { factor: 1 };
    expect(quantityIsTrivial(testQuantity)).toBe(true);
  });

  it("1.0 is trivial", () => {
    const testQuantity = { factor: 1.0 };
    expect(quantityIsTrivial(testQuantity)).toBe(true);
  });

  it("`undefined` is trivial", () => {
    const testQuantity = undefined;
    expect(quantityIsTrivial(testQuantity)).toBe(true);
  });

  it("-1 is not trivial", () => {
    const testQuantity = { factor: -1 };
    expect(quantityIsTrivial(testQuantity)).toBe(false);
  });

  it("-1.0 is not trivial", () => {
    const testQuantity = { factor: -1.0 };
    expect(quantityIsTrivial(testQuantity)).toBe(false);
  });

  it("1 foo is not trivial", () => {
    const testQuantity = { factor: 1.0, labels: ["foo"] };
    expect(quantityIsTrivial(testQuantity)).toBe(false);
  });

  it("0 is not trivial", () => {
    const testQuantity = { factor: 0 };
    expect(quantityIsTrivial(testQuantity)).toBe(false);
  });

  it("1 foo bar is not trivial", () => {
    const testQuantity = { factor: 1.0, labels: ["foo", "bar"] };
    expect(quantityIsTrivial(testQuantity)).toBe(false);
  });
});

suite("detects trivial ratios", () => {
  it("1/1 is trivial", () => {
    const testRatio = newRatio({
      numerator: { factor: 1 },
      denominator: { factor: 1 },
    });
    expect(isRatioTrivial(testRatio)).toBe(true);
  });

  it("-1/-1 is trivial", () => {
    const testRatio = newRatio({
      numerator: { factor: -1 },
      denominator: { factor: -1 },
    });
    expect(isRatioTrivial(testRatio)).toBe(true);
  });

  it("1.0 is trivial", () => {
    const testRatio = newRatio({ numerator: { factor: 1.0 } });
    expect(isRatioTrivial(testRatio)).toBe(true);
  });

  it("1.0/1.0 is trivial", () => {
    const testRatio = newRatio({
      numerator: { factor: 1.0 },
      denominator: { factor: 1.0 },
    });
    expect(isRatioTrivial(testRatio)).toBe(true);
  });

  it("1 / 1.0 is trivial", () => {
    const testRatio = newRatio({
      numerator: { factor: 1 },
      denominator: { factor: 1.0 },
    });
    expect(isRatioTrivial(testRatio)).toBe(true);
  });

  it("1.0 / 1 is trivial", () => {
    const testRatio = newRatio({
      numerator: { factor: 1.0 },
      denominator: { factor: 1 },
    });
    expect(isRatioTrivial(testRatio)).toBe(true);
  });

  it("2 is not trivial", () => {
    const testRatio = newRatio({ numerator: { factor: 2 } });
    expect(isRatioTrivial(testRatio)).toBe(false);
  });

  it("2/1 is not trivial", () => {
    const testRatio = newRatio({
      numerator: { factor: 2 },
      denominator: { factor: 1 },
    });
    expect(isRatioTrivial(testRatio)).toBe(false);
  });

  it("1/2 is not trivial", () => {
    const testRatio = newRatio({
      numerator: { factor: 1 },
      denominator: { factor: 2 },
    });
    expect(isRatioTrivial(testRatio)).toBe(false);
  });

  it("1 foo is not trivial", () => {
    const testRatio = newRatio({
      numerator: { factor: 1, labels: ["foo"] },
    });
    expect(isRatioTrivial(testRatio)).toBe(false);
  });

  it("1/1 foo is not trivial", () => {
    const testRatio = newRatio({
      numerator: { factor: 1 },
      denominator: { factor: 1, labels: ["foo"] },
    });
    expect(isRatioTrivial(testRatio)).toBe(false);
  });

  it("1 foo/1 is not trivial", () => {
    const testRatio = newRatio({
      numerator: { factor: 1, labels: ["foo"] },
      denominator: { factor: 1 },
    });
    expect(isRatioTrivial(testRatio)).toBe(false);
  });

  it("0/1 is not trivial", () => {
    const testRatio = newRatio({
      numerator: { factor: 0 },
      denominator: { factor: 1 },
    });
    expect(isRatioTrivial(testRatio)).toBe(false);
  });

  it("1/0 is not trivial", () => {
    const testRatio = newRatio({
      numerator: { factor: 1 },
      denominator: { factor: 0 },
    });
    expect(isRatioTrivial(testRatio)).toBe(false);
  });

  it("-1/1 is not trivial", () => {
    const testRatio = newRatio({
      numerator: { factor: -1 },
      denominator: { factor: 1 },
    });
    expect(isRatioTrivial(testRatio)).toBe(false);
  });
});

it("expects to simplify an expression", () => {
  const testExpression = newExpression([
    {
      numerator: { factor: 1 }, // <removed>
    },
    {
      numerator: { factor: 1, labels: ["foo"] }, // Checks numerator labels
    },
    {
      numerator: { factor: 1 }, // <removed>
    },
    {
      numerator: { factor: 3.3 }, // Checks numerator factor
    },
    {
      numerator: { factor: 1 },
      denominator: { factor: 1, labels: ["foo"] }, // Checks denominator labels
    },
    {
      numerator: { factor: 1 },
      denominator: { factor: 2 }, // Checks denominator factor
    },
    {
      numerator: { factor: 1 }, // <removed>
    },
  ]);

  expect(simplifyExpression(testExpression)).toHaveLength(4);
});

it("expects to insert a ratio in an expression", () => {
  const testExpression = newExpression([
    {
      numerator: { factor: 2 },
    },
    {
      numerator: { factor: 1, labels: ["foo"] },
    },
  ]);

  const modifiedExpression = insertRatio(
    testExpression,
    1,
    newRatio({
      numerator: { factor: 1, labels: ["bar"] },
    }),
  );

  expect(modifiedExpression).toHaveLength(3);
  expect(modifiedExpression[1].numerator).toEqual({
    factor: 1,
    labels: ["bar"],
  });
  expect(modifiedExpression[1].denominator).toBe(undefined);
});

suite("expects to update a ratio in an expression", () => {
  const testExpression = newExpression([
    {
      numerator: { factor: 2 },
    },
    {
      numerator: { factor: 1, labels: ["foo"] },
    },
  ]);

  it("expects to update a numerator", () => {
    const modifiedExpression = updateRatio(
      testExpression,
      0,
      "denominator",
      "2 foo",
    );

    expect(modifiedExpression[0].numerator).toEqual({
      factor: 2,
      labels: undefined,
    });
    expect(modifiedExpression[0].denominator).toEqual({
      factor: 2,
      labels: ["foo"],
    });
    expect(modifiedExpression[1].numerator).toEqual({
      factor: 1,
      labels: ["foo"],
    });
    expect(modifiedExpression[1].denominator).toBe(undefined);
  });

  it("expects to update a denominator", () => {
    const modifiedExpression = updateRatio(testExpression, 1, "numerator", "3");

    expect(modifiedExpression[0].numerator).toEqual({
      factor: 2,
      labels: undefined,
    });
    expect(modifiedExpression[0].denominator).toBe(undefined);
    expect(modifiedExpression[1].numerator).toEqual({
      factor: 3,
      labels: undefined,
    });
    expect(modifiedExpression[1].denominator).toBe(undefined);
  });

  it("expects a trivial update to not update", () => {
    const modifiedExpression = updateRatio(
      testExpression,
      0,
      "denominator",
      "1",
    );

    expect(modifiedExpression[0].numerator).toEqual({
      factor: 2,
    });
  });

  it("expects index out of bounds to not update", () => {
    const modifiedExpression1 = updateRatio(
      testExpression,
      2,
      "numerator",
      "3",
    );
    expect(modifiedExpression1[0].numerator).toEqual({
      factor: 2,
    });

    const modifiedExpression2 = updateRatio(
      testExpression,
      -1,
      "numerator",
      "3",
    );
    expect(modifiedExpression2[0].numerator).toEqual({
      factor: 2,
    });
  });
});

it("expects to remove a ratio from an expression", () => {
  const testExpression = newExpression([
    {
      numerator: { factor: 2 },
    },
    {
      numerator: { factor: 1, labels: ["foo"] },
    },
  ]);

  expect(testExpression).toHaveLength(2);

  const modifiedExpression = removeRatio(testExpression, 0);

  expect(modifiedExpression).toHaveLength(1);
  expect(modifiedExpression[0].numerator).toEqual({
    factor: 1,
    labels: ["foo"],
  });
  expect(modifiedExpression[0].denominator).toBe(undefined);

  const modifiedExpression1 = removeRatio(testExpression, 1);
  expect(modifiedExpression1).toHaveLength(1);
  expect(modifiedExpression1[0].numerator).toEqual({ factor: 2 });
  expect(modifiedExpression1[0].denominator).toBe(undefined);

  const modifiedExpression2 = removeRatio(testExpression, 0);
  expect(modifiedExpression2).toHaveLength(1);
  expect(modifiedExpression2[0].numerator).toEqual({
    factor: 1,
    labels: ["foo"],
  });
  expect(modifiedExpression2[0].denominator).toBe(undefined);

  const modifiedExpression3 = removeRatio(testExpression, 3);
  expect(modifiedExpression3).toHaveLength(2);

  const modifiedExpression4 = removeRatio(testExpression, -1);
  expect(modifiedExpression4).toHaveLength(2);
});

suite("expects to remove label overlap in an expression", () => {
  it("expects to remove a label overlap in the denominator", () => {
    const labels1 = ["foo", "bar"];
    const labels2 = ["foo"];

    expect(cancelOutUnits(labels1, labels2)).toEqual([["bar"], []]);
  });

  it("expects to remove a label overlap in the numerator", () => {
    const labels1 = ["foo"];
    const labels2 = ["foo", "bar"];

    expect(cancelOutUnits(labels1, labels2)).toEqual([[], ["bar"]]);
  });

  it("expects to order labels", () => {
    const labels1 = ["bar", "foo", "baz", "ace"];
    const labels2 = ["com", "tar", "gax"];

    expect(cancelOutUnits(labels1, labels2)).toEqual([
      ["ace", "bar", "baz", "foo"],
      ["com", "gax", "tar"],
    ]);
  });

  it("expects to group labels with exponents", () => {
    // prettier-ignore
    const labels1 = ["cod", "bar", "com", "bar", "com", "baz", "baz", "baz", "com"];
    const labels2 = ["foo", "foo", "goo", "lue", "roo", "goo", "roo", "roo"];

    expect(cancelOutUnits(labels1, labels2)).toEqual([
      ["baz^3", "com^3", "bar^2", "cod"],
      ["roo^3", "foo^2", "goo^2", "lue"],
    ]);
  });

  it("expects to handle empty labels", () => {
    expect(cancelOutUnits([], [])).toEqual([[], []]);
  });
});
