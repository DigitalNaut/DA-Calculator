import z from "zod";

const QuantitySchema = z.object({
  factor: z.number(),
  labels: z.map(z.string(), z.number()).optional(),
});

const RatioSchema = z.object({
  id: z.string(),
  numerator: QuantitySchema,
  denominator: QuantitySchema.optional(),
});

export const EquationSchema = z.array(RatioSchema);
export const BaseEquationSchema = z.array(RatioSchema.omit({ id: true }));

export type LabelCount = NonNullable<z.infer<typeof QuantitySchema>["labels"]>;
export type Quantity = z.infer<typeof QuantitySchema>;
export type Ratio = z.infer<typeof RatioSchema>;
export type QuantityPosition = keyof Omit<Ratio, "id">;
export type Expression = z.infer<typeof EquationSchema>;

export type BaseExpression = z.infer<typeof BaseEquationSchema>;
export type BaseRatio = BaseExpression[0];
