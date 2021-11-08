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

const buttonClasses = (appearance: Appearance) =>
  classNames({
    "border-grey-primary text-blue-primary bg-white-primary hover:bg-blue-primary hover:text-white-primary focus:ring-blue-primary":
      appearance === "primary",

    "border-red-secondary text-white-primary bg-red-secondary hover:bg-red-secondary-hover hover:border-red-secondary-hover focus:ring-red-primary":
      appearance === "warning",
    "inline-flex items-center w-full px-6 py-3 text-base rounded border font-medium shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-offset-2":
      true,
  });

export const ActionButton = (p: ActionButtonProps): JSX.Element => (
  <button type="button" className={buttonClasses(p.appearance)}>
    <div className="flex-none mr-4 -ml-4 w-8" aria-hidden="true">
      {p.label}
    </div>
    <p className="text-left">{p.description}</p>
  </button>
);
