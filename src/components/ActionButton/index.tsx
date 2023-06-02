import "@/index.css";

import classNames from "classnames";

import { Action, Level } from "@/primer-api";
import {
  actionDescription,
  actionName,
  actionType,
  ActionType,
} from "@/Actions";
import { ActionPanelButton, Appearance } from "@/components/ActionPanelButton";

// We will want other types of buttons styled roughly the same way
// We export all the styling combined except the width and padding
export const buttonClassesBase =
  "inline-flex items-center text-base rounded border font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
const buttonClassesPrimaryExtra =
  "border-grey-primary text-blue-primary bg-white-primary hover:bg-blue-primary hover:text-white-primary focus:ring-blue-primary";
export const buttonClassesPrimary = classNames(
  buttonClassesBase,
  buttonClassesPrimaryExtra
);
export const buttonClassesPad = "px-3 py-6";

export type ActionButtonProps = {
  level: Level;
  action: Action;
  onClick: (event: React.MouseEvent, action: Action) => void;
};

const appearance = (actionType: ActionType): Appearance => {
  switch (actionType) {
    case "Primary":
      return "primary";
    case "Destructive":
      return "danger";
  }
};

export const ActionButton = (p: ActionButtonProps): JSX.Element => {
  return (
    <ActionPanelButton
      appearance={appearance(actionType(p.action.contents))}
      name={actionName(p.action.contents)}
      description={actionDescription(p.action.contents, p.level)}
      onClick={(e) => p.onClick(e, p.action)}
    />
  );
};

export default ActionButton;
