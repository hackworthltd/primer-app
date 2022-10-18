import "@/index.css";
import {
  buttonClassesPrimary,
  buttonClassesPad,
} from "@/components/ActionButton";

import classNames from "classnames";

export interface GroupedButtonProps {
  label: string;
}

export interface GroupedButtonGroupProps {
  // NB: headings should be unique, as they are used as react keys
  heading: string;
  // NB: labels should be unique as they are used as react keys
  actions: GroupedButtonProps[];
}

export interface GroupedButtonListProps {
  groups: GroupedButtonGroupProps[];
  expanded: boolean;
  compact: boolean;
}

const buttonClasses = buttonClassesPrimary;
const buttonExtraClassesCompact = "p-6";
const buttonExtraClassesNonCompact = buttonClassesPad;

export const GroupedButtonList = ({
  groups,
  expanded,
  compact,
}: GroupedButtonListProps): JSX.Element => (
  <ul role="list">
    {groups.map((g) => (
      <details
        key={g.heading}
        className="py-1"
        open={expanded ? true : undefined}
      >
        <summary>{g.heading}</summary>
        <div
          className={
            compact ? "flex flex-row flex-wrap gap-2" : "flex flex-col"
          }
        >
          {g.actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={classNames(buttonClasses, {
                [buttonExtraClassesCompact]: compact,
                [buttonExtraClassesNonCompact]: !compact,
              })}
            >
              {action.label}
            </button>
          ))}
        </div>
      </details>
    ))}
  </ul>
);

export default GroupedButtonList;
