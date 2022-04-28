import { buttonClassesPrimary } from "@/ActionButton";
import classNames from "classnames";

export const InsertPrimitive = (): JSX.Element => (
  <div
    className={classNames(
      buttonClassesPrimary.replace("hover:text-white-primary", ""),
      "p-3"
    )}
  >
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      // type="number"
      placeholder="123..."
      className="rounded border-grey-primary bg-grey-primary shadow-inner"
    />
  </div>
);
