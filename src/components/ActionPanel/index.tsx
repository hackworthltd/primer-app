import "@/index.css";

import { ActionButton, ActionPanelButton } from "@/components";
import {
  Action,
  Level,
  InputAction,
  NoInputAction,
  Option,
  Options,
} from "@/primer-api";
import { actionType } from "@/Actions";
import { partition } from "fp-ts/lib/Array";
import { useState } from "react";
import { ActionInput } from "../ActionInput";

export interface ActionPanelProps {
  actions: Action[];
  level: Level;
  onAction: (action: NoInputAction) => void;
  onInputAction: (action: InputAction, option: Option) => void;
  onRequestOpts: (action: InputAction) => Promise<Options>;
}

type State =
  | { state: "ActionList" }
  | { state: "Input"; action: InputAction; opts: Options };

export const ActionPanel = ({
  actions,
  level,
  onAction,
  onInputAction,
  onRequestOpts,
}: ActionPanelProps): JSX.Element => {
  const [state, setState] = useState<State>({ state: "ActionList" });
  return (
    <div className="h-full overflow-scroll bg-grey-primary p-4 pt-2">
      <div className="flex flex-row py-4 font-bold text-blue-primary lg:text-lg">
        {"Actions"}
      </div>
      {(() => {
        switch (state.state) {
          case "ActionList":
            return (
              <ul role="list">
                {sortActions(actions).map((action) => (
                  <li key={action.contents} className="pt-2">
                    <ActionButton
                      level={level}
                      action={action}
                      onClick={(_, action) => {
                        switch (action.tag) {
                          case "NoInput":
                            onAction(action.contents);
                            break;
                          case "Input": {
                            onRequestOpts(action.contents).then((opts) => {
                              setState({
                                state: "Input",
                                action: action.contents,
                                opts,
                              });
                            });
                            break;
                          }
                        }
                      }}
                    />
                  </li>
                ))}
              </ul>
            );
          case "Input": {
            const onOption = (option: Option) => {
              onInputAction(state.action, option);
              setState({ state: "ActionList" });
            };
            return (
              <div>
                <div>
                  {state.opts.free != "FreeNone" && (
                    <div className="mb-3 pt-2">
                      <ActionInput
                        sort={state.opts.free}
                        onSubmit={(option) => onOption({ option })}
                      ></ActionInput>
                    </div>
                  )}
                  <ul>
                    {state.opts.opts.map((option) => (
                      <li key={JSON.stringify(option)} className="pt-2">
                        <ActionPanelButton
                          appearance="primary"
                          onClick={(_) => onOption(option)}
                          name={{ text: option.option, style: "code" }}
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <ActionPanelButton
                      appearance="danger"
                      onClick={(_) => setState({ state: "ActionList" })}
                      description="Cancel"
                    />
                  </div>
                </div>
              </div>
            );
          }
        }
      })()}
    </div>
  );
};

// Put all destructive actions last.
const sortActions = (actions: Action[]): Action[] => {
  const { left, right } = partition(
    (a: Action) => actionType(a.contents) == "Destructive"
  )(actions);
  return left.concat(right);
};

export default ActionPanel;
