import {
  insertRatio,
  newExpression,
  newRatio,
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

it("expects to update a ratio in an expression", () => {
  const testExpression = newExpression([
    {
      numerator: { factor: 2 },
    },
    {
      numerator: { factor: 1, labels: ["foo"] },
    },
  ]);

  let modifiedExpression = updateRatio(
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

  modifiedExpression = updateRatio(testExpression, 1, "numerator", "3");

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
