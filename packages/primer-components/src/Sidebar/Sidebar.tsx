import {
  InformationCircleIcon,
  FolderIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
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
export type SidebarProps = {
  prog: Prog;
  initialMode: Tab;
  onClickDef: OnClick;
  onClickAdd: OnClick;
};
type OnClick = (
  label: string,
  event: React.MouseEvent<HTMLButtonElement>
) => void;

type Tab = "T&D" | "Info" | "Folder";

export const Sidebar = (p: SidebarProps): JSX.Element => {
  const [currentTab, switchTab] = useState(p.initialMode);

  const tab = (tab: Tab, element: JSX.Element): JSX.Element => (
    <button
      key={tab}
      className={classNames(
        "flex rounded",
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
    <div style={{ height: 800 }} className="flex flex-col w-96">
      <div className="grid grid-cols-3 h-16 text-grey-secondary">
        {tab("T&D", <div className="text-xl font-bold text-center">T&D</div>)}
        {tab("Info", <InformationCircleIcon className="h-8" />)}
        {tab("Folder", <FolderIcon className="h-8" />)}
      </div>
      <div className="flex-auto p-6 bg-grey-primary rounded">
        {TabContents(currentTab, p.prog, p.onClickDef, p.onClickAdd)}
      </div>
    </div>
  );
};

const TabContents = (
  _tab: Tab,
  prog: Prog,
  onClickDef: OnClick,
  onClickAdd: OnClick
): JSX.Element => {
  // TODO making this conditional causes a runtime failure due to React hooks...
  // switch (tab) {
  //   case "T&D":
  return TypesAndDefinitions(prog, onClickDef, onClickAdd);
  // case "Info":
  //   return <div>Placeholder - "Info" view not implemented</div>;
  // case "Folder":
  //   return <div>Placeholder - "Folder" view not implemented</div>;
  // }
};

const TypesAndDefinitions = (
  prog: Prog,
  onClickDef: OnClick,
  onClickAdd: OnClick
): JSX.Element => {
  return (
    <div>
      <div className="pb-3 text-xl font-bold text-blue-primary">
        Types & Definitions
      </div>

      <div className="flex flex-col gap-5 p-2 leading-8">
        {DefList("TYPES", prog.types, "font-bold", "", onClickDef, onClickAdd)}
        {DefList(
          "DEFINITIONS",
          prog.defs,
          "font-bold",
          "",
          onClickDef,
          onClickAdd
        )}
        {DefList(
          "IMPORTED TYPES",
          prog.importedDefs,
          "italic font-bold",
          "italic",
          onClickDef
        )}
        {DefList(
          "IMPORTED DEFINITIONS",
          prog.importedTypes,
          "italic font-bold",
          "italic",
          onClickDef
        )}
      </div>
    </div>
  );
};

const DefList = (
  heading: string,
  elems: string[],
  headerStyle: string,
  defStyle: string,
  onClickDef: OnClick,
  onClickAdd?: OnClick
): JSX.Element => {
  const [expanded, setExpanded] = useState(true);

  const iconClasses = "w-5 stroke-blue-primary stroke-[3px]";

  return (
    <div>
      <div className="flex gap-2">
        <div className={classNames("text-blue-primary", headerStyle)}>
          {heading}
        </div>
        {expanded ? (
          <button onClick={(_) => setExpanded(false)}>
            <ChevronDownIcon className={iconClasses} />
          </button>
        ) : (
          <button onClick={(_) => setExpanded(true)}>
            <ChevronLeftIcon className={iconClasses} />
          </button>
        )}
        {typeof onClickAdd !== "undefined" ? (
          <button onClick={(e) => onClickAdd(heading, e)}>
            <PlusIcon className={iconClasses} />
          </button>
        ) : (
          []
        )}
      </div>
      <div className="flex flex-col items-start">
        {expanded
          ? elems.map((def) => (
              <button
                className={classNames(
                  "text-grey-secondary underline",
                  defStyle
                )}
                onClick={(e) => onClickDef(def, e)}
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
