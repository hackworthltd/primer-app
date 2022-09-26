import "@/index.css";

import classNames from "classnames";
import { ActionType, OfferedAction } from "@hackworthltd/primer-types";

export type ActionButtonProps = Omit<OfferedAction, "priority">;

const buttonClassesBase =
  "inline-flex items-center text-base rounded border font-medium shadow-sm bg-white-primary focus:outline-none focus:ring-2 focus:ring-offset-2";
const buttonClassesWidth = "w-full";
const buttonClassesPrimaryExtra =
  "border-grey-primary text-blue-primary bg-white-primary hover:bg-blue-primary hover:text-white-primary focus:ring-blue-primary";
const buttonClassesSecondaryExtra =
  "border-red-secondary text-white-primary bg-red-secondary hover:bg-red-secondary-hover hover:border-red-secondary-hover focus:ring-red-primary";

// We will want other types of buttons styled roughly the same way
// We export all the styling combined except the width and padding
export const buttonClassesPrimary = classNames(
  buttonClassesBase,
  buttonClassesPrimaryExtra
);
export const buttonClassesSecondary = classNames(
  buttonClassesBase,
  buttonClassesSecondaryExtra
);
export const buttonClassesPad = "px-1 py-6 pl-7";

const buttonClasses = (appearance: ActionType) =>
  classNames({
    [buttonClassesPrimaryExtra]: appearance === "Primary",
    [buttonClassesSecondaryExtra]: appearance === "Destructive",
    [buttonClassesBase]: true,
    [buttonClassesWidth]: true,
    [buttonClassesPad]: true,
  });

export const ActionButton = (p: ActionButtonProps): JSX.Element => (
  <button type="button" className={buttonClasses(p.actionType)}>
    <div className="mr-4 -ml-4 w-8 flex-none" aria-hidden="true">
      {p.name.contents}
    </div>
    <p className="text-left">{p.description}</p>
  </button>
);
