import {
  CodeBracketIcon,
  ShareIcon,
  ArrowUturnLeftIcon,
  EllipsisHorizontalIcon,
  BeakerIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { MouseEventHandler, useRef, useState } from "react";
import { useDraggable, DragOptions } from "@neodrag/react";
import { Level } from "@/primer-api";
import type { EvalFullProps } from "@/components/EvalFull";
import { EvalFull } from "@/components";

export type FloatingToolbarProps = {
  initialPosition: { x: number; y: number };
  initialMode: Mode;
  level: Level;
  onModeChange: (
    mode: Mode,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  onLevelChange: () => void;
  redoAvailable: boolean;
  onClickRedo: MouseEventHandler<HTMLButtonElement>;
  undoAvailable: boolean;
  onClickUndo: MouseEventHandler<HTMLButtonElement>;
} & EvalFullProps;
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

const levelSvg = (level: Level) => {
  switch (level) {
    case "Beginner":
      return <BeakerIcon />;
    case "Intermediate":
      return <AcademicCapIcon />;
    case "Expert":
      return <RocketLaunchIcon />;
  }
};

const levelButtonTitle = (level: Level) => {
  switch (level) {
    case "Beginner":
      return "Beginner";
    case "Intermediate":
      return "Intermediate";
    case "Expert":
      return "Expert";
  }
};

// https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/130
// eslint-disable-next-line tailwindcss/no-custom-classname
const arrow = <ArrowUturnLeftIcon className="w-6 stroke-[3]" />;
const undoRedoClasses =
  "flex flex-col items-center w-12 hover:bg-grey-primary-hover rounded disabled:opacity-50 disabled:cursor-not-allowed";

export const FloatingToolbar = (p: FloatingToolbarProps): JSX.Element => {
  const [mode, setMode] = useState(p.initialMode);
  const [touchDragging, setTouchDragging] = useState(false);

  const draggableRef = useRef(null);
  const options: DragOptions = {
    defaultPosition: p.initialPosition,
    handle: ".neodrag-react-handle",
    bounds: "parent",
    onDragStart: (_) => {
      setTouchDragging(true);
    },
    onDragEnd: (_) => {
      setTouchDragging(false);
    },
  };
  useDraggable(draggableRef, options);

  return (
    <div
      ref={draggableRef}
      className={classNames(
        "rounded bg-grey-primary absolute z-30 grid grid-cols-5 grid-rows-5 divide-x divide-grey-quaternary",
        touchDragging ? "shadow-2xl -my-1 -mx-2" : "shadow-lg"
      )}
    >
      <div className="neodrag-react-handle col-span-1 row-span-5 flex w-20 select-none flex-col items-center justify-center gap-2 p-4 text-blue-primary">
        <div className="-mb-1 -mt-2 w-6">
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
          onClick={p.onClickRedo}
          disabled={!p.redoAvailable}
          className={undoRedoClasses}
        >
          <div className="scale-x-[-1]">{arrow}</div>
          redo
        </button>
        <button
          type="button"
          onClick={p.onClickUndo}
          disabled={!p.undoAvailable}
          className={classNames(undoRedoClasses, "text-red-secondary")}
        >
          {arrow}
          undo
        </button>
        <button
          title={levelButtonTitle(p.level)}
          type="button"
          onClick={p.onLevelChange}
          className="flex h-12 w-12 flex-col items-center rounded text-blue-primary hover:bg-blue-primary hover:text-white-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {levelSvg(p.level)}
          level
        </button>
      </div>
      <div className="col-span-4 row-span-5">
        <EvalFull {...p} />
      </div>
    </div>
  );
};

export default FloatingToolbar;
