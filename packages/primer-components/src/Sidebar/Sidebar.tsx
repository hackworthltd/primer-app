import {
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/outline";
import { useState } from "react";
import classNames from "classnames";

export type Prog = {
  defs: string[];
  types: string[];
  importedDefs: string[];
  importedTypes: string[];
};

export type SidebarProps = { initialMode: Tab } & TypesAndDefinitionsProps;
type TypesAndDefinitionsProps = {
  prog: Prog;
  onClickDef: OnClick;
  onClickAdd: OnClick;
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
      <div className="flex flex-col self-center w-full">{element}</div>
    </button>
  );

  return (
    <div className="flex flex-col w-96 h-[800px]">
      <div className="grid shrink-0 grid-cols-2 h-16 text-grey-secondary">
        {tab("T&D", <div className="text-xl font-bold text-center">T&D</div>)}
        {tab("Info", <InformationCircleIcon className="h-8" />)}
      </div>
      <div className="p-6 pr-4 h-full bg-grey-primary">
        {TabContents(currentTab, p)}
      </div>
    </div>
  );
};

const TabContents = (tab: Tab, p: TypesAndDefinitionsProps): JSX.Element => {
  switch (tab) {
    case "T&D":
      return <TypesAndDefinitions {...p}></TypesAndDefinitions>;
    case "Info":
      return <div>Placeholder - &quot;Info&quot; view not implemented</div>;
  }
};

const TypesAndDefinitions = ({
  onClickDef,
  onClickAdd,
  prog,
}: TypesAndDefinitionsProps): JSX.Element => {
  return (
    <div className="overflow-auto h-full">
      <div className="pb-3 text-xl font-bold text-blue-primary">
        Types & Definitions
      </div>

      <div className="flex flex-col gap-5 p-2 leading-8">
        <DefList
          heading="Types"
          elems={prog.types}
          headerStyle="font-bold"
          defStyle=""
          {...{ onClickDef, onClickAdd }}
        />
        <DefList
          heading="Definitions"
          elems={prog.defs}
          headerStyle="font-bold"
          defStyle=""
          {...{ onClickDef, onClickAdd }}
        />
        <DefList
          heading="Imported Types"
          elems={prog.importedTypes}
          headerStyle="italic font-bold"
          defStyle="italic"
          {...{ onClickDef }}
        />
        <DefList
          heading="Imported Definitions"
          elems={prog.importedDefs}
          headerStyle="italic font-bold"
          defStyle="italic"
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
  headerStyle: string;
  defStyle: string;
  onClickDef: OnClick;
  onClickAdd?: OnClick;
}): JSX.Element => {
  const [expanded, setExpanded] = useState(true);

  const iconClasses = "w-5 stroke-blue-primary stroke-[3px]";

  return (
    <div>
      <div className="flex gap-2">
        <div
          className={classNames(
            "text-blue-primary text-lg mb-1",
            p.headerStyle
          )}
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
      <div className="flex flex-col gap-3 items-start">
        {expanded
          ? p.elems.map((def) => (
              <button
                className={classNames(
                  "text-grey-secondary underline text-left leading-5",
                  p.defStyle
                )}
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
