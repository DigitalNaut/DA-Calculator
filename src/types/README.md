# General types for the project

Here I'll try to make sense of the types used in the project.

> ***Note:** These types are more mathematically-based than the ones used in the frontend. The frontend types are geared towards rendering and user interaction, so for example a `Quantity` in the frontend corresponds to a `Unit` component, and a `Ratio` to a `Subunit` component, and an `Expression` to an `Equation` component.*

Since we're using Zod, it's only fair we start with the Zod schemas.

## Expression Types

`QuantitySchema` is used for quantities in the form of a factor with labels. For example, `2 kg` or `3 m/s`. It has a `factor` and a `labels` property.

The `factor` is the value of the quantity, and the `labels`, which are a map of strings to numbers, where the string is the label and the number is the exponent. Example: `{"kg": 1, "m": 2}`. This means that the quantity is `2 kg^1 m^2`.
The `labels` property is optional, so it can be an empty object. This is useful for quantities that don't have any labels, like `2` or `3.14`. In this case, the quantity is just a number.

## Ratio Schema

`RatioSchema` is used for ratios in the form of a numerator divided by a denominator. It has an `id`, a `numerator`, and an optional `denominator`.

The `id` is a unique identifier for the ratio, which is used for rendering purposes to use as a `key`. 

The `numerator` of the ratio and the `denominator` are both of type `QuantitySchema`. The `denominator` is optional, and if it is not provided, the denominator defaults to `1`.

## Expression Schema

`ExpressionSchema` is used for defining expressions. They're a list of ratios, which are the building blocks of the expression.

