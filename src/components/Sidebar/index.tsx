import {
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

const subHeaderStyle = "mb-1 text-sm lg:text-base font-bold text-blue-primary";
const itemStyle =
  "block truncate font-code text-sm lg:text-base leading-5 text-left text-grey-secondary";

export type SidebarProps = {
  prog: Prog;
  onClickDef: OnClick;
  onClickTypeDef: OnClick;
  onClickAddDef: (name: string) => void;
  onClickAddTypeDef: () => void;
};
type OnClick = (
  label: string,
  event: React.MouseEvent<HTMLButtonElement>
) => void;

export const Sidebar = ({
  onClickDef,
  onClickTypeDef,
  onClickAddDef,
  onClickAddTypeDef,
  prog,
}: SidebarProps): JSX.Element => {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-grey-primary p-4 pt-2">
      <div className="flex-none py-4 font-bold text-blue-primary lg:text-lg">
        Types & Definitions
      </div>
      <div className="min-h-0 flex-auto overflow-y-auto">
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

export default Sidebar;
