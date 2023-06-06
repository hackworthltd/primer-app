import {
  CodeBracketIcon,
  ShareIcon,
  ArrowUturnLeftIcon,
  BeakerIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { MouseEventHandler, useState } from "react";
import { Level } from "@/primer-api";

export type ToolbarProps = {
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

export const Toolbar = (p: ToolbarProps): JSX.Element => {
  const [mode, setMode] = useState(p.initialMode);

  return (
    <div className="flex select-none flex-row items-center justify-center gap-2 rounded bg-grey-primary p-2 text-sm font-medium text-blue-primary shadow-sm">
      <button
        type="button"
        onClick={(e) => {
          const m = nextMode(mode);
          setMode(m);
          p.onModeChange(m, e);
        }}
        className="flex h-6 w-12 flex-col items-center rounded bg-blue-primary text-white-primary shadow-lg hover:bg-blue-secondary"
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
  );
};

export default Toolbar;
