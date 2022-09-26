import "@/index.css";

import { ActionButton } from "@/ActionButton/ActionButton";
import { partition } from "fp-ts/lib/Array";
import { OfferedAction } from "@hackworthltd/primer-types";

export interface ActionButtonListProps {
  actions: OfferedAction[];
}

export const ActionButtonList = ({
  actions,
}: ActionButtonListProps): JSX.Element => (
  <ul role="list">
    {sortActions(actions).map((action) => (
      <li key={action.description} className="py-1">
        <ActionButton {...action} />
      </li>
    ))}
  </ul>
);

// Put all destructive actions last, and otherwise sort by priority.
const sortActions = (actions: OfferedAction[]): OfferedAction[] => {
  const { left, right } = partition(
    (a: OfferedAction) => a.actionType == "Destructive"
  )(actions);
  const primary = left.sort((a, b) => a.priority - b.priority);
  const destructive = right.sort((a, b) => a.priority - b.priority);
  return primary.concat(destructive);
};
