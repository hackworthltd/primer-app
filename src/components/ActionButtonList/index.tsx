import "@/index.css";

import { ActionButton } from "@/components";
import { Action, GetAvailableActionsLevel } from "@/primer-api";
import { actionType } from "@/Actions";
import { partition } from "fp-ts/lib/Array";

export interface ActionButtonListProps {
  actions: Action[];
  level: GetAvailableActionsLevel;
}

export const ActionButtonList = ({
  actions,
  level,
}: ActionButtonListProps): JSX.Element => (
  <ul role="list" className="h-full overflow-scroll bg-grey-primary p-4 pt-2">
    {sortActions(actions).map((action) => (
      <li key={action.contents} className="pt-2">
        <ActionButton {...{ action, level }} />
      </li>
    ))}
  </ul>
);

// Put all destructive actions last.
const sortActions = (actions: Action[]): Action[] => {
  const { left, right } = partition(
    (a: Action) => actionType(a.contents) == "Destructive"
  )(actions);
  return left.concat(right);
};

export default ActionButtonList;
