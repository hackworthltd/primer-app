import {
  CodeIcon,
  ShareIcon,
  ReplyIcon,
  ChevronDownIcon,
} from "@heroicons/react/outline";
import classNames from "classnames";
import { MouseEventHandler, useState } from "react";
import Draggable from "react-draggable";

export type FloatingToolbarProps = {
  initialMode: Mode;
  onModeChange: (mode: Mode) => void;
  onClickRedo: MouseEventHandler<HTMLButtonElement>;
  onClickUndo: MouseEventHandler<HTMLButtonElement>;
  onClickChevron: MouseEventHandler<HTMLButtonElement>;
};
export type Mode = "text" | "tree";

const modeSvg = (m: Mode) => {
  switch (m) {
    case "text":
      return <CodeIcon className="p-0.5" />;
    case "tree":
      return <ShareIcon className="p-1 rotate-90" />;
  }
};
const nextMode = (m: Mode): Mode => {
  switch (m) {
    case "text":
      return "tree";
    case "tree":
      return "text";
  }
};

const arrow = <ReplyIcon className="w-6 stroke-[3]" />;
const undoRedoClasses =
  "flex flex-col items-center w-12 hover:bg-grey-primary-hover rounded";

export const FloatingToolbar = (p: FloatingToolbarProps): JSX.Element => {
  const [mode, setMode] = useState(p.initialMode);

  return (
    <Draggable>
      <div
        className="flex flex-col gap-2 justify-center items-center
          p-4 w-20 text-blue-primary bg-grey-primary
          rounded shadow-lg"
      >
        <button
          type="button"
          onClick={(_) => {
            const m = nextMode(mode);
            setMode(m);
            p.onModeChange(m);
          }}
          className="flex flex-col items-center
            w-12 h-6 text-white-primary bg-blue-primary hover:bg-blue-secondary rounded shadow-lg"
        >
          {modeSvg(mode)}
        </button>
        <button
          type="button"
          className={undoRedoClasses}
          onClick={p.onClickRedo}
        >
          <div className="scale-x-[-1]">{arrow}</div>
          redo
        </button>
        <button
          type="button"
          onClick={p.onClickUndo}
          className={classNames(undoRedoClasses, "text-red-secondary")}
        >
          {arrow}
          undo
        </button>
        <button type="button" onClick={p.onClickChevron}>
          <ChevronDownIcon className="w-6" />
        </button>
      </div>
    </Draggable>
  );
};
