import {
  CodeBracketIcon,
  ShareIcon,
  ArrowUturnLeftIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { MouseEventHandler, useState } from "react";
import Draggable from "react-draggable";

export type FloatingToolbarProps = {
  initialMode: Mode;
  onModeChange: (
    mode: Mode,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  onClickRedo: MouseEventHandler<HTMLButtonElement>;
  onClickUndo: MouseEventHandler<HTMLButtonElement>;
  onClickChevron: MouseEventHandler<HTMLButtonElement>;
};
export type Mode = "text" | "tree";

const modeSvg = (m: Mode) => {
  switch (m) {
    case "text":
      return <CodeBracketIcon className="p-0.5" />;
    case "tree":
      return <ShareIcon className="rotate-90 p-1" />;
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

// https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/130
// eslint-disable-next-line tailwindcss/no-custom-classname
const arrow = <ArrowUturnLeftIcon className="w-6 stroke-[3]" />;
const undoRedoClasses =
  "flex flex-col items-center w-12 hover:bg-grey-primary-hover rounded";

export const FloatingToolbar = (p: FloatingToolbarProps): JSX.Element => {
  const [mode, setMode] = useState(p.initialMode);
  const [touchDragging, setTouchDragging] = useState(false);

  return (
    <Draggable
      cancel="button"
      onStart={(e) => {
        if (e.type == "touchstart") setTouchDragging(true);
      }}
      onStop={(_) => setTouchDragging(false)}
    >
      <div
        className={classNames(
          "flex flex-col gap-2 justify-center items-center",
          "text-blue-primary bg-grey-primary rounded shadow-lg",
          "select-none",
          "absolute z-30",
          touchDragging ? "p-5 w-24 -my-1 -mx-2" : "p-4 w-20"
        )}
      >
        <div className="-mt-2 -mb-1 w-6">
          <EllipsisHorizontalIcon className="stroke-grey-secondary" />
          <EllipsisHorizontalIcon className="-mt-4 stroke-grey-secondary" />
        </div>
        <button
          type="button"
          onClick={(e) => {
            const m = nextMode(mode);
            setMode(m);
            p.onModeChange(m, e);
          }}
          className="flex h-6 w-12
            flex-col items-center rounded bg-blue-primary text-white-primary shadow-lg hover:bg-blue-secondary"
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

export default FloatingToolbar;
