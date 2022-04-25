import {
  CodeIcon,
  ShareIcon,
  ReplyIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";
import classNames from "classnames";

export type FloatingToolbarProps = { mode: Mode };
export type Mode = "text" | "tree";

const modeSvg = (m: Mode) => {
  switch (m) {
    case "text":
      return <CodeIcon className="p-0.5" />;
    case "tree":
      return <ShareIcon className="rotate-90 p-1" />;
  }
};

const arrow = <ReplyIcon className="stroke-[3] w-6" />;
const undoRedoClasses =
  "flex flex-col items-center hover:bg-grey-primary-hover w-12 rounded";

export const FloatingToolbar = (p: FloatingToolbarProps): JSX.Element => (
  <div
    className="flex flex-col items-center justify-center gap-2 
    bg-grey-primary text-blue-primary rounded shadow-lg
    w-20 p-4"
  >
    <button
      className="flex flex-col items-center
      bg-blue-primary text-white-primary rounded shadow-lg h-6 w-12 hover:bg-blue-secondary"
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
      <ChevronUpIcon className="w-6" />
    </button>
  </div>
);
