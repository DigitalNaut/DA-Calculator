import type { LabelCount, Quantity } from "src/types/expressions";
import {
  insertRatio,
  isRatioTrivial,
  newExpression,
  newRatio,
  quantityIsTrivial,
  cancelOutLabels,
  removeRatio,
  simplifyExpression,
  updateRatio,
  stringifyLabels,
} from "./equation-wrangler";

it("expects to get a new default expression", () => {
  const testExpression = newExpression();
  expect(testExpression).toHaveLength(1);

  expect(testExpression[0].id).toBeTypeOf("string");
  expect(testExpression[0].id.length).toBeGreaterThan(0);
  expect(testExpression[0].numerator).toEqual<Quantity>({
    factor: 1,
    labels: undefined,
  });
  expect(testExpression[0].denominator).toBe(undefined);
});

it("expects to get a new expression from an input object", () => {
  const testExpression = newExpression([
    {
      numerator: { factor: 5, labels: new Map([["foo", 1]]) },
      denominator: { factor: 1, labels: new Map([["bar", 1]]) },
    },
  ]);

  // Length
  expect(testExpression).toHaveLength(1);

  // ID
  expect(testExpression[0]).toHaveProperty("id");
  expect(testExpression[0].id).toBeTypeOf("string");
  expect(testExpression[0].id.length).toBeGreaterThan(0);

  // Numerator
  expect(testExpression[0].numerator).toEqual<Quantity>({
    factor: 5,
    labels: new Map([["foo", 1]]),
  });

  // Denominator
  expect(testExpression[0].denominator).toEqual<Quantity>({
    factor: 1,
    labels: new Map([["bar", 1]]),
  });
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
    expect(
      quantityIsTrivial({
        factor: 1.0,
        labels: new Map([["foo", 1]]),
      }),
    ).toBe(false);
  });

  it("0 is not trivial", () => {
    const testQuantity = { factor: 0 };
    expect(quantityIsTrivial(testQuantity)).toBe(false);
  });

  it("1 foo bar is not trivial", () => {
    expect(
      quantityIsTrivial({
        factor: 1.0,
        labels: new Map([
          ["foo", 1],
          ["bar", 1],
        ]),
      }),
    ).toBe(false);
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
    expect(
      isRatioTrivial(
        newRatio({
          numerator: { factor: 1, labels: new Map([["foo", 1]]) },
        }),
      ),
    ).toBe(false);
  });

  it("1/1 foo is not trivial", () => {
    expect(
      isRatioTrivial(
        newRatio({
          numerator: { factor: 1 },
          denominator: { factor: 1, labels: new Map([["foo", 1]]) },
        }),
      ),
    ).toBe(false);
  });

  it("1 foo/1 is not trivial", () => {
    const testRatio = newRatio({
      numerator: { factor: 1, labels: new Map([["foo", 1]]) },
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

it("expects to remove trivial ratios", () => {
  const testExpression = newExpression([
    {
      numerator: { factor: 1 }, // Trivial
    },
    {
      numerator: { factor: 1, labels: new Map([["foo", 1]]) }, // Has numerator labels
    },
    {
      numerator: { factor: 1 }, // Trivial
    },
    {
      numerator: { factor: 3.3 }, // Has numerator factor
    },
    {
      numerator: { factor: 1 },
      denominator: { factor: 1, labels: new Map([["foo", 1]]) }, // Has denominator labels
    },
    {
      numerator: { factor: 1 },
      denominator: { factor: 2 }, // Has denominator factor
    },
    {
      numerator: { factor: 1 }, // Trivial
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
      numerator: { factor: 1, labels: new Map([["foo", 1]]) },
    },
  ]);

  const modifiedExpression = insertRatio(
    testExpression,
    1,
    newRatio({
      numerator: { factor: 1, labels: new Map([["bar", 1]]) },
    }),
  );

  expect(modifiedExpression).toHaveLength(3);
  expect(modifiedExpression[1].numerator).toEqual<Quantity>({
    factor: 1,
    labels: new Map([["bar", 1]]),
  });
  expect(modifiedExpression[1].denominator).toBe(undefined);
});

suite("expects to update a ratio in an expression", () => {
  const testExpression = newExpression([
    {
      numerator: { factor: 2 },
    },
    {
      numerator: { factor: 1, labels: new Map([["foo", 1]]) },
    },
  ]);

  it("can update a numerator", () => {
    const modifiedExpression = updateRatio(
      testExpression,
      0,
      "denominator",
      "2 foo",
    );

    expect(modifiedExpression[0].numerator).toEqual<Quantity>({
      factor: 2,
      labels: undefined,
    });
    expect(modifiedExpression[0].denominator).toEqual<Quantity>({
      factor: 2,
      labels: new Map([["foo", 1]]),
    });
    expect(modifiedExpression[1].numerator).toEqual<Quantity>({
      factor: 1,
      labels: new Map([["foo", 1]]),
    });
    expect(modifiedExpression[1].denominator).toBe(undefined);
  });

  it("can update a denominator", () => {
    const modifiedExpression = updateRatio(testExpression, 1, "numerator", "3");

    expect(modifiedExpression[0].numerator).toEqual<Quantity>({
      factor: 2,
      labels: undefined,
    });
    expect(modifiedExpression[0].denominator).toBe(undefined);
    expect(modifiedExpression[1].numerator).toEqual<Quantity>({
      factor: 3,
      labels: undefined,
    });
    expect(modifiedExpression[1].denominator).toBe(undefined);
  });

  it("can ignore a trivial update", () => {
    const modifiedExpression = updateRatio(
      testExpression,
      0,
      "denominator",
      "1",
    );

    expect(modifiedExpression[0].numerator).toEqual<Quantity>({
      factor: 2,
    });
  });

  it("can handle index out of bounds", () => {
    const modifiedExpression1 = updateRatio(
      testExpression,
      2,
      "numerator",
      "3",
    );
    expect(modifiedExpression1[0].numerator).toEqual<Quantity>({
      factor: 2,
    });

    const modifiedExpression2 = updateRatio(
      testExpression,
      -1,
      "numerator",
      "3",
    );
    expect(modifiedExpression2[0].numerator).toEqual<Quantity>({
      factor: 2,
    });
  });
});

it("can remove a ratio from an expression", () => {
  const testExpression = newExpression([
    {
      numerator: { factor: 2 },
    },
    {
      numerator: { factor: 1, labels: new Map([["foo", 1]]) },
    },
  ]);

  expect(testExpression).toHaveLength(2);

  const modifiedExpression = removeRatio(testExpression, 0);

  expect(modifiedExpression).toHaveLength(1);
  expect(modifiedExpression[0].numerator).toEqual<Quantity>({
    factor: 1,
    labels: new Map([["foo", 1]]),
  });
  expect(modifiedExpression[0].denominator).toBe(undefined);

  const modifiedExpression1 = removeRatio(testExpression, 1);
  expect(modifiedExpression1).toHaveLength(1);
  expect(modifiedExpression1[0].numerator).toEqual<Quantity>({ factor: 2 });
  expect(modifiedExpression1[0].denominator).toBe(undefined);

  const modifiedExpression2 = removeRatio(testExpression, 0);
  expect(modifiedExpression2).toHaveLength(1);
  expect(modifiedExpression2[0].numerator).toEqual<Quantity>({
    factor: 1,
    labels: new Map([["foo", 1]]),
  });
  expect(modifiedExpression2[0].denominator).toBe(undefined);

  const modifiedExpression3 = removeRatio(testExpression, 3);
  expect(modifiedExpression3).toHaveLength(2);

  const modifiedExpression4 = removeRatio(testExpression, -1);
  expect(modifiedExpression4).toHaveLength(2);
});

suite("expects to cancel out label overlaps in an expression", () => {
  it("can remove a label overlap in the denominator", () => {
    const labels1 = new Map([
      ["foo", 1],
      ["bar", 1],
    ]);
    const labels2 = new Map([["foo", 1]]);

    expect(cancelOutLabels(labels1, labels2)).toEqual<LabelCount>(
      new Map([["bar", 1]]),
    );
  });

  it("can remove a label overlap in the numerator", () => {
    const labels1 = new Map([["foo", 1]]);
    const labels2 = new Map([
      ["foo", 1],
      ["bar", 1],
    ]);

    expect(cancelOutLabels(labels1, labels2)).toEqual<LabelCount>(
      new Map([["bar", -1]]),
    );
  });

  it("can cancel out simple label overlaps", () => {
    const labels1 = new Map([
      ["bar", 1],
      ["foo", 1],
      ["baz", 1],
      ["ace", 1],
    ]);
    const labels2 = new Map([
      ["com", 1],
      ["tar", 1],
      ["gax", 1],
    ]);

    expect(cancelOutLabels(labels1, labels2)).toEqual<LabelCount>(
      new Map([
        ["ace", 1],
        ["bar", 1],
        ["baz", 1],
        ["foo", 1],
        ["com", -1],
        ["gax", -1],
        ["tar", -1],
      ]),
    );
  });

  it("can handle complex label overlaps", () => {
    const labels1 = new Map([
      ["cod", 1],
      ["bar", 2],
      ["com", 3],
      ["baz", 3],
    ]); // ["cod", "bar", "com", "bar", "com", "baz", "baz", "baz", "com"]
    const labels2 = new Map([
      ["foo", 2],
      ["goo", 2],
      ["lue", 1],
      ["roo", 3],
    ]); // ["foo", "foo", "goo", "lue", "roo", "goo", "roo", "roo"]

    expect(cancelOutLabels(labels1, labels2)).toEqual<LabelCount>(
      new Map([
        ["baz", 3],
        ["com", 3],
        ["bar", 2],
        ["cod", 1],
        ["roo", -3],
        ["foo", -2],
        ["goo", -2],
        ["lue", -1],
      ]),
    );
  });

  it("can handle empty labels", () => {
    expect(cancelOutLabels(new Map(), new Map())).toEqual<LabelCount>(
      new Map(),
    );
  });
});

suite("expects to stringify labels in order", () => {
  it("can stringify labels", () => {
    expect(stringifyLabels(new Map([["foo", 1]]))).toEqual("foo");
    expect(stringifyLabels(new Map([["foo", 0]]))).toEqual("");
    expect(
      stringifyLabels(
        new Map([
          ["foo", 1],
          ["bar", 1],
        ]),
      ),
    ).toEqual("bar • foo");
    expect(
      stringifyLabels(
        new Map([
          ["foo", 1],
          ["bar", -1],
        ]),
      ),
    ).toEqual("foo / bar");
    expect(
      stringifyLabels(
        new Map([
          ["zoo", 3],
          ["goo", 2],
          ["foo", 2],
          ["bar", 0],
          ["baz", -1],
          ["quux", -4],
          ["tar", -3],
        ]),
      ),
    ).toEqual("zoo^3 • foo^2 • goo^2 / quux^4 • tar^3 • baz");
  });

  it("can handle empty labels", () => {
    expect(stringifyLabels(new Map())).toEqual("");
  });
});
