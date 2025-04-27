import z from "zod";

const QuantitySchema = z.object({
  factor: z.number(),
  labels: z.map(z.string(), z.number()).optional(),
});

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
