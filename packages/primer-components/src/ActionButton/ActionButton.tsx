import "@/index.css";

import classNames from "classnames";

export type Appearance = "primary" | "warning";

export interface ActionButtonProps {
  /**
   * Pre-defined button appearances.
   *
   * @type {Appearance}
   */
  appearance: Appearance;

  /**
   * The button label.
   *
   * @type {string}
   */
  label: string;

  /**
   * The action description.
   *
   * @type {string}
   */
  description: string;
}

const buttonClassesBase =
  "inline-flex items-center text-base rounded border font-medium shadow-sm bg-white-primary focus:outline-none focus:ring-2 focus:ring-offset-2";
const buttonClassesWidth = "w-full";
const buttonClassesPrimaryExtra =
  "border-grey-primary text-blue-primary bg-white-primary hover:bg-blue-primary hover:text-white-primary focus:ring-blue-primary";
const buttonClassesSecondaryExtra =
  "border-red-secondary text-white-primary bg-red-secondary hover:bg-red-secondary-hover hover:border-red-secondary-hover focus:ring-red-primary";

// We will want other types of buttons styled roughly the same way
// We export all the styling combined except the width and padding
export const buttonClassesPrimary = classNames(
  buttonClassesBase,
  buttonClassesPrimaryExtra
);
export const buttonClassesSecondary = classNames(
  buttonClassesBase,
  buttonClassesSecondaryExtra
);
export const buttonClassesPad = "px-1 py-6 pl-7";

const buttonClasses = (appearance: Appearance) =>
  classNames({
    [buttonClassesPrimaryExtra]: appearance === "primary",
    [buttonClassesSecondaryExtra]: appearance === "warning",
    [buttonClassesBase]: true,
    [buttonClassesWidth]: true,
    [buttonClassesPad]: true,
  });

export const ActionButton = (p: ActionButtonProps): JSX.Element => (
  <button type="button" className={buttonClasses(p.appearance)}>
    <div className="flex-none mr-4 -ml-4 w-8" aria-hidden="true">
      {p.label}
    </div>
    <p className="text-left">{p.description}</p>
  </button>
);
