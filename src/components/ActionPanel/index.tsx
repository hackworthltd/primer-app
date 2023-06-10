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
import { MouseEventHandler, useState } from "react";
import { ActionInput } from "../ActionInput";

export interface ActionPanelProps {
  onClickAddDef: MouseEventHandler<HTMLButtonElement>;
  onClickAddTypeDef: MouseEventHandler<HTMLButtonElement>;
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
  onClickAddDef,
  onClickAddTypeDef,
  actions,
  level,
  onAction,
  onInputAction,
  onRequestOpts,
}: ActionPanelProps): JSX.Element => {
  const [state, setState] = useState<State>({ state: "ActionList" });
  return (
    <div className="h-full bg-grey-primary p-4 pt-2">
      {(() => {
        switch (state.state) {
          case "ActionList":
            return (
              <div className="flex h-full flex-col overflow-hidden">
                <div className="flex-none py-4 font-bold text-blue-primary lg:text-lg">
                  Actions
                </div>
                <div className="min-h-0 flex-auto overflow-y-auto">
                  <div className="border-b-2 border-grey-quaternary pb-6">
                    <ul role="list">
                      <li className="pt-2">
                        <ActionPanelButton
                          appearance="primary"
                          onClick={onClickAddDef}
                          name={{ text: "+d", style: "prose" }}
                          description="Add a new definition"
                        />
                      </li>
                      <li className="pt-2">
                        <ActionPanelButton
                          appearance="primary"
                          onClick={onClickAddTypeDef}
                          name={{ text: "+t", style: "prose" }}
                          description="Add a new type"
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4">
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
                                  onRequestOpts(action.contents).then(
                                    (opts) => {
                                      setState({
                                        state: "Input",
                                        action: action.contents,
                                        opts,
                                      });
                                    }
                                  );
                                  break;
                                }
                              }
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          case "Input": {
            const onOption = (option: Option) => {
              onInputAction(state.action, option);
              setState({ state: "ActionList" });
            };
            return (
              <div className="flex h-full flex-col overflow-hidden">
                {state.opts.free === "FreeNone" ? (
                  <div className="flex-none py-4 font-bold text-blue-primary lg:text-lg">
                    Select an option
                  </div>
                ) : (
                  <>
                    <div className="flex-none">
                      <div className="py-4 font-bold text-blue-primary lg:text-lg">
                        Enter a value
                      </div>
                      <div className="mb-3 pt-2">
                        <ActionInput
                          sort={state.opts.free}
                          onSubmit={(option) =>
                            // Note: `matchesType` here is really a
                            // don't-care, as the backend ignores it,
                            // but it's required by the type. We
                            // should break the `Option` type into two
                            // different server-provided and
                            // client-provided types.
                            onOption({ option, matchesType: false })
                          }
                        ></ActionInput>
                      </div>
                    </div>
                    {state.opts.opts.length > 0 && (
                      <div className="flex-none py-4 pl-4 text-blue-primary">
                        …or choose one:
                      </div>
                    )}
                  </>
                )}
                <div className="min-h-0 shrink overflow-y-auto">
                  <ul>
                    {state.opts.opts.map((option) => (
                      <li key={JSON.stringify(option)} className="pt-2">
                        <ActionPanelButton
                          appearance={
                            option.matchesType ? "exactMatch" : "primary"
                          }
                          onClick={(_) => onOption(option)}
                          name={{ text: option.option, style: "code" }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-none pt-2">
                  <ActionPanelButton
                    appearance="danger"
                    onClick={(_) => setState({ state: "ActionList" })}
                    description="Cancel"
                  />
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
