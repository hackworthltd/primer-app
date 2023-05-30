import {
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import classNames from "classnames";
import { EvalFullResp, GlobalName, Level, TypeOrKind } from "@/primer-api";
import { TreeReactFlowOne } from "@/components";
import { defaultTreeReactFlowProps } from "../TreeReactFlow";

export type Prog = {
  defs: string[];
  types: string[];
  importedDefs: string[];
  importedTypes: string[];
};

const headerStyle = "pb-3 text-base lg:text-lg font-bold text-blue-primary";
const subHeaderStyle = "mb-1 text-sm lg:text-base font-bold text-blue-primary";
const itemStyle =
  "font-code text-sm lg:text-base leading-5 text-left text-grey-secondary";

export type SidebarProps = { initialMode: Tab } & TypesAndDefinitionsProps &
  InfoProps &
  EvalProps;
type TypesAndDefinitionsProps = {
  prog: Prog;
  onClickDef: OnClick;
  onClickTypeDef: OnClick;
  onClickAddDef: (name: string) => void;
  onClickAddTypeDef: () => void;
};
type InfoProps = {
  shadowed: boolean;
  type?: TypeOrKind;
  folder: string;
};
type EvalProps = {
  moduleName: string[];
  evalFull: {
    request: (baseName: string | undefined) => void;
    result?: EvalFullResp;
  };
  level: Level;
};
type OnClick = (
  label: string,
  event: React.MouseEvent<HTMLButtonElement>
) => void;

type Tab = "T&D" | "Info" | "Eval";

export const Sidebar = (p: SidebarProps): JSX.Element => {
  const [currentTab, switchTab] = useState(p.initialMode);

  const tab = (tab: Tab, element: JSX.Element): JSX.Element => (
    <button
      key={tab}
      className={classNames(
        "flex",
        tab == currentTab
          ? "text-blue-primary border-y-8 border-t-transparent"
          : "hover:text-blue-secondary hover:border-y-8 hover:border-t-transparent"
      )}
      onClick={(_) => switchTab(tab)}
    >
      <div className="flex w-full flex-col self-center">{element}</div>
    </button>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="grid h-20 grid-cols-3 text-grey-secondary">
        {tab(
          "T&D",
          <div className="text-center text-base font-bold lg:text-lg">T&D</div>
        )}
        {tab("Info", <InformationCircleIcon className="h-8" />)}
        {tab("Eval", <PlayCircleIcon className="h-8" />)}
      </div>
      <div className="h-full overflow-scroll bg-grey-primary p-6 pr-4">
        {(() => {
          switch (currentTab) {
            case "T&D":
              return <TypesAndDefinitions {...p}></TypesAndDefinitions>;
            case "Info":
              return <Info {...p}></Info>;
            case "Eval":
              return <Eval {...p} defs={p.prog.defs}></Eval>;
          }
        })()}
      </div>
    </div>
  );
};

const TypesAndDefinitions = ({
  onClickDef,
  onClickTypeDef,
  onClickAddDef,
  onClickAddTypeDef,
  prog,
}: TypesAndDefinitionsProps): JSX.Element => {
  return (
    <div className="h-full overflow-auto">
      <div className={headerStyle}>Types & Definitions</div>

      <div className="flex flex-col gap-5 p-2 leading-8">
        <DefList
          heading="Types"
          elems={prog.types}
          italic={false}
          {...{ onClickDef: onClickTypeDef, onClickAdd: onClickAddTypeDef }}
        />
        <DefList
          heading="Definitions"
          elems={prog.defs}
          italic={false}
          {...{ onClickDef, onClickAdd: onClickAddDef }}
        />
        <DefList
          heading="Imported Types"
          elems={prog.importedTypes}
          italic={true}
          {...{ onClickDef: onClickTypeDef }}
        />
        <DefList
          heading="Imported Definitions"
          elems={prog.importedDefs}
          italic={true}
          {...{ onClickDef }}
        />
      </div>
    </div>
  );
};

const DefList = ({
  onClickAdd,
  ...p
}: {
  heading: string;
  elems: string[];
  italic: boolean;
  onClickDef: OnClick;
  onClickAdd?: OnClick;
}): JSX.Element => {
  const [expanded, setExpanded] = useState(true);

  const iconClasses = "w-5 stroke-blue-primary stroke-[3px]";

  return (
    <div>
      <div className="flex gap-2">
        <div
          className={classNames(subHeaderStyle, {
            ["italic"]: p.italic,
          })}
        >
          {p.heading}
        </div>
        {expanded ? (
          <button onClick={(_) => setExpanded(false)}>
            <ChevronDownIcon className={iconClasses} />
          </button>
        ) : (
          <button onClick={(_) => setExpanded(true)}>
            <ChevronRightIcon className={iconClasses} />
          </button>
        )}
        {typeof onClickAdd !== "undefined" ? (
          <button onClick={(e) => onClickAdd(p.heading, e)}>
            <PlusIcon className={iconClasses} />
          </button>
        ) : (
          []
        )}
      </div>
      <div className="flex flex-col items-start gap-1">
        {expanded
          ? p.elems.map((def) => (
              <button
                className={classNames(itemStyle, "underline", {
                  ["italic"]: p.italic,
                })}
                onClick={(e) => p.onClickDef(def, e)}
                key={def}
              >
                {def}
              </button>
            ))
          : []}
      </div>
    </div>
  );
};

const Info = ({ shadowed, type, folder }: InfoProps): JSX.Element => {
  return (
    <div className="h-full overflow-auto">
      <div className={headerStyle}>Selection Info</div>
      <div className="flex flex-col gap-5 p-2 leading-8">
        {shadowed ? (
          <div className="flex items-center gap-1 text-red-primary">
            <InformationCircleIcon className="h-4" />
            <div>
              <span>The definition has been </span>
              <span className="underline">shadowed</span>
              <span>.</span>
            </div>
          </div>
        ) : (
          []
        )}
	  {type ? (
        <div>
          <div className={subHeaderStyle}>{type.tag}</div>
          <div className={itemStyle}>{JSON.stringify(type)}</div>
        </div>) : ([])}
        <div>
          <div className={subHeaderStyle}>Folder</div>
          <div className={itemStyle}>{folder}</div>
        </div>
      </div>
    </div>
  );
};

const Evaluated = (p: {
  defName: GlobalName;
  evaluated?: EvalFullResp;
  level: Level;
}) => {
  return (
    <TreeReactFlowOne
      {...defaultTreeReactFlowProps}
      {...(p?.evaluated ? { tree: p?.evaluated?.contents } : {})}
      level={p.level}
    />
  );
};

// We only offer to evaluate the definitions in the "main" module
const Eval = ({
  defs,
  evalFull,
  moduleName,
  level,
}: EvalProps & { defs: string[] }): JSX.Element => {
  const [evalDef, setEvalDef0] = useState("");
  const setEvalDef = (e: string) => {
    setEvalDef0(e);
    evalFull.request(e === "" ? undefined : e);
  };
  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className={headerStyle}>Evaluation</div>
      <div className="flex grow flex-col gap-5 overflow-hidden p-2 leading-8">
        <div>
          <div className={subHeaderStyle}>Evaluating</div>
          <select value={evalDef} onChange={(e) => setEvalDef(e.target.value)}>
            <option key="" value="">
              ---None---
            </option>
            {
              /* NB: all def names are distinct and non-empty*/
              defs.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))
            }
          </select>
        </div>
        {evalDef !== "" && (
          <>
            <div className="grow">
              <div className={subHeaderStyle}>gives</div>
              <Evaluated
                defName={{ qualifiedModule: moduleName, baseName: evalDef }}
                {...(evalFull.result ? { evaluated: evalFull.result } : {})}
                level={level}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
