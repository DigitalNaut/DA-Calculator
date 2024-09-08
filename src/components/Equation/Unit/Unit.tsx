import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useMemo } from "react";

import { Subunit } from ".";
import Parenthesis from "../Parenthesis";
import { UnitProps } from "../types";

function Separator() {
  return <div className="h-[1px] w-full bg-white" />;
}

export default function Unit({
  index,
  inputRatio,
  onChangeInput,
  onDeleteUnit,
}: UnitProps) {
  const isDivisionBy1 = useMemo(
    () =>
      inputRatio.denominator?.factor === 1 &&
      inputRatio.denominator.labels?.length === 0,
    [inputRatio.denominator?.factor, inputRatio.denominator?.labels],
  );

  return (
    <div className="group relative flex items-center">
      {isDivisionBy1 ? null : <Parenthesis />}

      <div className="flex h-full flex-col rounded-2xl bg-gray-700 hover:bg-gray-600">
        <div className="flex h-full grow">
          <Subunit
            inputQuantity={inputRatio.numerator}
            onChangeInput={onChangeInput}
            index={index}
            quantityPosition={"numerator"}
          />
        </div>

        <div
          className={clsx({
            "hidden group-focus-within:block group-hover:block": isDivisionBy1,
          })}
        >
          <Separator />
          <Subunit
            inputQuantity={inputRatio.denominator || { factor: 1 }}
            onChangeInput={onChangeInput}
            index={index}
            quantityPosition={"denominator"}
          />
        </div>
      </div>

      {isDivisionBy1 ? null : <Parenthesis right />}

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
