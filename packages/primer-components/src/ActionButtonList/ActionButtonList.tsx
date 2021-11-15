import "@/index.css";

import { ActionButton, ActionButtonProps } from "@/ActionButton/ActionButton";

interface ActionButtonListProps {
  actions: ActionButtonProps[];
}

export const ActionButtonList = ({
  actions,
}: ActionButtonListProps): JSX.Element => (
  <ul role="list">
    {actions.map((action) => (
      <li key={action.description} className="py-1">
        <ActionButton {...action} />
      </li>
    ))}
  </ul>
);
