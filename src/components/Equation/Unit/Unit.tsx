import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useMemo } from "react";

import { quantityIsTrivial } from "src/logic/expression-wrangler";
import { cn } from "src/utils/styles";
import Parenthesis from "../Parenthesis";
import type { UnitProps } from "../types";
import Subunit from "./Subunit";

function Divider() {
  return <div className="h-px w-full bg-white" />;
}

export default function Unit({
  index,
  inputRatio,
  onChangeInput,
  onDeleteUnit,
  isFocused,
  onFocused,
}: UnitProps) {
  const isTrivialDenominator = useMemo(
    () => quantityIsTrivial(inputRatio.denominator),
    [inputRatio.denominator],
  );

  return (
    <div
      className={cn("group/unit relative flex items-center", {
        "gap-0.5": !isTrivialDenominator,
      })}
    >
      {isTrivialDenominator ? null : <Parenthesis />}

      <div className="flex flex-col rounded-lg group-hover/unit:bg-slate-700">
        <div className="flex grow">
          <Subunit
            inputQuantity={inputRatio.numerator}
            onChangeInput={onChangeInput}
            index={index}
            quantityPosition={"numerator"}
            isFocused={isFocused}
            onFocused={onFocused}
          />
        </div>

        <div
          className={clsx({
            "hidden group-focus-within/unit:block group-hover/unit:block":
              isTrivialDenominator,
          })}
        >
          <Divider />
          <Subunit
            inputQuantity={inputRatio.denominator || { factor: 1 }}
            onChangeInput={onChangeInput}
            index={index}
            quantityPosition={"denominator"}
          />
        </div>
      </div>

      {isTrivialDenominator ? null : <Parenthesis right />}

      <button
        type="button"
        className="absolute top-0 right-0 z-50 hidden aspect-square translate-x-1/4 -translate-y-1/3 items-center justify-center rounded-full bg-white p-1 group-hover/unit:flex group-focus-within/unit:group-hover/unit:hidden"
        onClick={onDeleteUnit}
      >
        <FontAwesomeIcon className="text-slate-900" icon={faTimes} size="xs" />
      </button>
    </div>
  );
}
