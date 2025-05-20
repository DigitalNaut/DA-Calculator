import z from "zod";

/**
 * A quantity is a number (factor) with optional labels
 * Labels are a table of strings to numbers, where the string is the label and the number is the exponent
 */
const QuantitySchema = z.object({
  factor: z.number(),
  labels: z.record(z.string(), z.number()).optional(),
});

/**
 * A ratio is a quantity divided by another quantity
 * The denominator is optional, and if it is not provided, the denominator defaults to 1
 * It includes an id for rendering purposes
 */
const BaseRatioSchema = z.object({
  numerator: QuantitySchema,
  denominator: QuantitySchema.optional(),
});
export const BaseExpressionSchema = z.array(BaseRatioSchema);

export const RatioSchema = BaseRatioSchema.extend({
  id: z.string().length(18),
});
export const ExpressionSchema = z.array(RatioSchema);

export type LabelCount = NonNullable<z.infer<typeof QuantitySchema>["labels"]>;
export type Quantity = z.infer<typeof QuantitySchema>;
export type Ratio = z.infer<typeof RatioSchema>;
//            ^?
export type BaseRatio = z.infer<typeof BaseRatioSchema>;
//            ^?
export type QuantityPosition = keyof BaseRatio;
export type Expression = z.infer<typeof ExpressionSchema>;

export type BaseExpression = z.infer<typeof BaseExpressionSchema>;
