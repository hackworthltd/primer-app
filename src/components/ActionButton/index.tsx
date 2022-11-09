import "@/index.css";

import classNames from "classnames";
import { Action, GetAvailableActionsLevel } from "@/primer-api";
import {
  actionDescription,
  actionName,
  actionType,
  ActionType,
} from "@/Actions";

export type ActionButtonProps = {
  level: GetAvailableActionsLevel;
  action: Action;
};

// We will want other types of buttons styled roughly the same way
// We export all the styling combined except the width and padding
export const buttonClassesBase =
  "inline-flex items-center text-base rounded border font-medium shadow-sm bg-white-primary focus:outline-none focus:ring-2 focus:ring-offset-2";
const buttonClassesWidth = "w-full";
const buttonClassesPrimaryExtra =
  "border-grey-primary text-blue-primary bg-white-primary hover:bg-blue-primary hover:text-white-primary focus:ring-blue-primary";
const buttonClassesSecondaryExtra =
  "border-red-secondary text-white-primary bg-red-secondary hover:bg-red-secondary-hover hover:border-red-secondary-hover focus:ring-red-primary";
export const buttonClassesPrimary = classNames(
  buttonClassesBase,
  buttonClassesPrimaryExtra
);
export const buttonClassesSecondary = classNames(
  buttonClassesBase,
  buttonClassesSecondaryExtra
);
export const buttonClassesPad = "px-3 py-6";

const buttonClasses = (appearance: ActionType) =>
  classNames({
    [buttonClassesPrimaryExtra]: appearance === "Primary",
    [buttonClassesSecondaryExtra]: appearance === "Destructive",
    [buttonClassesBase]: true,
    [buttonClassesWidth]: true,
    [buttonClassesPad]: true,
  });

export const ActionButton = (p: ActionButtonProps): JSX.Element => {
  const name = actionName(p.action.contents);
  return (
    <button
      type="button"
      className={buttonClasses(actionType(p.action.contents))}
    >
      <div
        className={classNames("mr-4 w-8 flex-none", name.font)}
        aria-hidden="true"
      >
        {name.text}
      </div>
      <p className="text-left">
        {actionDescription(p.action.contents, p.level)}
      </p>
    </button>
  );
};

export default ActionButton;
