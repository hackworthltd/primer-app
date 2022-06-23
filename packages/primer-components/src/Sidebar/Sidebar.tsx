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

  return (
    <div style={{ height: 800 }} className="flex flex-col w-96">
      <div className="grid grid-cols-3 h-16 text-grey-secondary">
        {(
          [
            ["T&D", <div className="text-xl font-bold text-center">T&D</div>],
            ["Info", <InformationCircleIcon className="h-8" />],
            ["Folder", <FolderIcon className="h-8" />],
          ] as const
        ).map(([tab, element]) => (
          <button
            className={classNames(
              "flex hover:text-blue-primary hover:border-y-8 hover:border-t-transparent",
              {
                "text-blue-primary border-y-8 border-t-transparent":
                  tab == currentTab,
              }
            )}
            onClick={(_) => switchTab(tab)}
          >
            <div className="flex flex-col self-center w-full">{element}</div>
          </button>
        ))}
      </div>
      <div className="flex-auto p-6 bg-grey-primary">
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
      <div className="pb-3 text-xl font-bold">Types & Definitions</div>

      <div className="flex flex-col gap-5 p-2 leading-8">
        {DefList("TYPES", prog.types, "font-bold", onClickDef, onClickAdd)}
        {DefList("DEFINITIONS", prog.defs, "font-bold", onClickDef, onClickAdd)}
        {DefList(
          "IMPORTED TYPES",
          prog.importedDefs,
          "italic font-bold",
          onClickDef
        )}
        {DefList(
          "IMPORTED DEFINITIONS",
          prog.importedTypes,
          "italic font-bold",
          onClickDef
        )}
      </div>
    </div>
  );
};

const DefList = (
  heading: string,
  elems: string[],
  textStyle: string,
  onClickDef: OnClick,
  onClickAdd?: OnClick
): JSX.Element => {
  const [expanded, setExpanded] = useState(true);

  const iconClasses = "w-5 stroke-blue-primary stroke-[3px]";

  return (
    <div>
      <div className="flex gap-2">
        <div className={textStyle}>{heading}</div>
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
              <button className="underline" onClick={(e) => onClickDef(def, e)}>
                {def}
              </button>
            ))
          : []}
      </div>
    </div>
  );
};
