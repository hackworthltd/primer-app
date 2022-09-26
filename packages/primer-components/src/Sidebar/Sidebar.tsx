import {
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import classNames from "classnames";

export type Prog = {
  defs: string[];
  types: string[];
  importedDefs: string[];
  importedTypes: string[];
};

const headerStyle = "pb-3 text-xl font-bold text-blue-primary";
const subHeaderStyle = "mb-1 text-lg font-bold text-blue-primary";
const itemStyle = "leading-5 text-left text-grey-secondary";

export type SidebarProps = { initialMode: Tab } & TypesAndDefinitionsProps &
  InfoProps;
type TypesAndDefinitionsProps = {
  prog: Prog;
  onClickDef: OnClick;
  onClickAdd: OnClick;
};
type InfoProps = {
  shadowed: boolean;
  type: string;
  folder: string;
};
type OnClick = (
  label: string,
  event: React.MouseEvent<HTMLButtonElement>
) => void;

type Tab = "T&D" | "Info";

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
      <div className="grid h-20 grid-cols-2 text-grey-secondary">
        {tab("T&D", <div className="text-center text-xl font-bold">T&D</div>)}
        {tab("Info", <InformationCircleIcon className="h-8" />)}
      </div>
      <div className="h-full overflow-scroll bg-grey-primary p-6 pr-4">
        {(() => {
          switch (currentTab) {
            case "T&D":
              return <TypesAndDefinitions {...p}></TypesAndDefinitions>;
            case "Info":
              return <Info {...p}></Info>;
          }
        })()}
      </div>
    </div>
  );
};

const TypesAndDefinitions = ({
  onClickDef,
  onClickAdd,
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
          {...{ onClickDef, onClickAdd }}
        />
        <DefList
          heading="Definitions"
          elems={prog.defs}
          italic={false}
          {...{ onClickDef, onClickAdd }}
        />
        <DefList
          heading="Imported Types"
          elems={prog.importedTypes}
          italic={true}
          {...{ onClickDef }}
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
      <div className="flex flex-col items-start gap-3">
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
        <div>
          <div className={subHeaderStyle}>Type</div>
          <div className={itemStyle}>{type}</div>
        </div>
        <div>
          <div className={subHeaderStyle}>Folder</div>
          <div className={itemStyle}>{folder}</div>
        </div>
      </div>
    </div>
  );
};
