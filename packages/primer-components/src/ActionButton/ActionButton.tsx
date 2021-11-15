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
    "border-indigo-700 text-indigo-700 hover:bg-indigo-700 hover:text-white focus:ring-indigo-500":
      appearance === "primary",
    "border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500":
      appearance === "warning",
    "inline-flex items-center w-full px-6 py-3 text-base rounded border font-medium shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-offset-2": true,
  });

export const ActionButton = (p: ActionButtonProps): JSX.Element => (
  <button type="button" className={buttonClasses(p.appearance)}>
    <div className="w-8 flex-none mr-4 -ml-4" aria-hidden="true">
      {p.label}
    </div>
    <p className="text-left">{p.description}</p>
  </button>
);
