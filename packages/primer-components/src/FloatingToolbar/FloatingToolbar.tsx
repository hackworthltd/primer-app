import {
  CodeIcon,
  ShareIcon,
  ReplyIcon,
  ChevronDownIcon,
} from "@heroicons/react/outline";
import classNames from "classnames";

export type FloatingToolbarProps = { mode: Mode };
export type Mode = "text" | "tree";

const modeSvg = (m: Mode) => {
  switch (m) {
    case "text":
      return <CodeIcon className="p-0.5" />;
    case "tree":
      return <ShareIcon className="p-1 rotate-90" />;
  }
};

const arrow = <ReplyIcon className="w-6 stroke-[3]" />;
const undoRedoClasses =
  "flex flex-col items-center w-12 hover:bg-grey-primary-hover rounded";

export const FloatingToolbar = (p: FloatingToolbarProps): JSX.Element => (
  <div
    className="flex flex-col gap-2 justify-center items-center 
    p-4 w-20 text-blue-primary bg-grey-primary
    rounded shadow-lg"
  >
    <button
      className="flex flex-col items-center
      w-12 h-6 text-white-primary bg-blue-primary hover:bg-blue-secondary rounded shadow-lg"
    >
      {modeSvg(p.mode)}
    </button>
    <button type="button" className={undoRedoClasses}>
      <div className="-scale-x-100">{arrow}</div>
      redo
    </button>
    <button
      type="button"
      className={classNames(undoRedoClasses, "text-red-secondary")}
    >
      {arrow}
      undo
    </button>
    <button>
      <ChevronDownIcon className="w-6" />
    </button>
  </div>
);
