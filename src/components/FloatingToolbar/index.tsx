import {
  CodeBracketIcon,
  ShareIcon,
  ArrowUturnLeftIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  BeakerIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { MouseEventHandler, useRef, useState } from "react";
import { useDraggable, DragOptions } from "@neodrag/react";
import { Level } from "@/primer-api";

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
    cancel: "button",
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
        "flex flex-col gap-2 justify-center items-center",
        "text-blue-primary bg-grey-primary rounded shadow-lg",
        "select-none",
        "absolute z-30",
        touchDragging ? "p-5 w-24 -my-1 -mx-2" : "p-4 w-20"
      )}
    >
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
      <button type="button" onClick={p.onClickChevron}>
        <ChevronDownIcon className="w-6" />
      </button>
    </div>
  );
};

export default FloatingToolbar;
