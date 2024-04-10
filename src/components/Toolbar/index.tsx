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

const iconClasses = "stroke-[2] p-1";
const heavyIconClasses = "w-7 stroke-[3] p-1";

const modeSvg = (m: Mode) => {
  switch (m) {
    case "text":
      return <CodeBracketIcon className={iconClasses} />;
    case "tree":
      return <ShareIcon className={classNames(iconClasses, "rotate-90")} />;
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
      return <BeakerIcon className={iconClasses} />;
    case "Intermediate":
      return <AcademicCapIcon className={iconClasses} />;
    case "Expert":
      return <RocketLaunchIcon className={iconClasses} />;
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

const arrow = <ArrowUturnLeftIcon className={heavyIconClasses} />;

type appearance = "primary" | "warning";

const buttonClasses = (appearance: appearance, canBeDisabled: boolean) =>
  classNames(
    "flex h-12 w-12 flex-col items-center rounded hover:text-white-primary",
    {
      "text-blue-primary hover:bg-blue-primary": appearance === "primary",
      "text-red-secondary hover:bg-red-secondary": appearance === "warning",
      "disabled:cursor-not-allowed disabled:opacity-50": canBeDisabled,
    }
  );

export const Toolbar = (p: ToolbarProps): JSX.Element => {
  const [mode, setMode] = useState(p.initialMode);

  return (
    <div className="flex select-none flex-row items-center justify-center gap-2 rounded bg-grey-primary p-2 text-sm font-medium text-blue-primary shadow-sm">
      <button
        title={levelButtonTitle(p.level)}
        type="button"
        onClick={p.onLevelChange}
        className={buttonClasses("primary", false)}
      >
        {levelSvg(p.level)}
        level
      </button>
      <button
        type="button"
        onClick={(e) => {
          const m = nextMode(mode);
          setMode(m);
          p.onModeChange(m, e);
        }}
        className={buttonClasses("primary", false)}
      >
        {modeSvg(mode)}
        {mode}
      </button>
      <button
        type="button"
        onClick={p.onClickRedo}
        disabled={!p.redoAvailable}
        className={buttonClasses("primary", true)}
      >
        <div className="-scale-x-100">{arrow}</div>
        redo
      </button>
      <button
        type="button"
        onClick={p.onClickUndo}
        disabled={!p.undoAvailable}
        className={buttonClasses("warning", true)}
      >
        {arrow}
        undo
      </button>
    </div>
  );
};

export default Toolbar;
