import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useMemo } from "react";

import { Subunit } from ".";
import Parenthesis from "../Parenthesis";
import { UnitProps } from "../types";
import { quantityIsTrivial } from "src/logic/equation-wrangler";

function Divider() {
  return <div className="h-[1px] w-full bg-white" />;
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
    <div className="group relative flex items-center gap-1">
      {isTrivialDenominator ? null : <Parenthesis />}

      <div className="flex h-full flex-col rounded-lg bg-gray-700 hover:bg-gray-600">
        <div className="flex h-full grow">
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
            "hidden group-focus-within:block group-hover:block":
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
        className="absolute right-0 top-0 z-50 hidden group-hover:block"
        onClick={onDeleteUnit}
      >
        <FontAwesomeIcon icon={faTimesCircle} />
      </button>
    </div>
  );
}
