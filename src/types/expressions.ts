import z from "zod";

/**
 * A quantity is a number (factor) with optional labels
 * Labels are a map of strings to numbers, where the string is the label and the number is the exponent
 */
const QuantitySchema = z.object({
  factor: z.number(),
  labels: z.map(z.string(), z.number()).optional(),
});

/**
 * A ratio is a quantity divided by another quantity
 * The denominator is optional, and if it is not provided, the denominator defaults to 1
 * It includes an id for rendering purposes
 */
const RatioSchema = z.object({
  id: z.string().length(18),
  numerator: QuantitySchema,
  denominator: QuantitySchema.optional(),
});

export const ExpressionSchema = z.array(RatioSchema);
export const BaseExpressionSchema = z.array(RatioSchema.omit({ id: true }));

export type LabelCount = NonNullable<z.infer<typeof QuantitySchema>["labels"]>;
export type Quantity = z.infer<typeof QuantitySchema>;
export type Ratio = z.infer<typeof RatioSchema>;
export type QuantityPosition = keyof Omit<Ratio, "id">;
export type Expression = z.infer<typeof ExpressionSchema>;

export type BaseExpression = z.infer<typeof BaseExpressionSchema>;
export type BaseRatio = BaseExpression[0];
