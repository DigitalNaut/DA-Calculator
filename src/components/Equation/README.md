# The Equation System Component

## Overview

The equation system component is used to render an expression.

It comes with its own set of action buttons that can be used to interact with the equation.

## Usage

```ts
import { Equation } from '@components/Equation';

export function App() {
  return (
    <Equation
      // ...
      actionButtons={
        <>
          <Equation.ActionButton
            mode="blue"
            icon={faClone}
            title="Duplicate equation"
            onClick={() => {
              // Duplicate equation
            }
          />
          <Equation.ActionButton
            mode="red"
            icon={faTrash}
            title="Delete equation"
            onClick={() => {
              // Delete equation
            })}
          />
        </>
      }
    />
  );
}
```

## Implementation Details

### Overview

Since the equations are based on the traditional factor-label method, the component is accepts input from left to right with keyboard shortcuts. Each part of the equation is represented by a vertically aligned Unit component, which is itself composed of two Subunit components divided by a slash. The top subunit is the numerator and the bottom subunit is the denominator. Additionally, a couple buttons are rendered on hover to interact with the unit, such as deleting it or flipping its values.

The state is completely managed by the state store, which updates the expression depending on the user input. No state is kept in the component itself with the sole exception being the input field for each subunit. This is an unmanaged input element embedded that only updates when the user blurs the field through a natural update cycle. All the child components share an `input` and an `onChange` prop to help manage the state.

The absolute positioned input field is only visible upon hover or an active focus on the subunit, but otherwise should not be visible. The input field should be perfectly overlaid on top of the formatted display text for a seamless editing UX.