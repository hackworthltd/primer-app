import "@/index.css";

import classNames from "classnames";

export type Size = "responsive" | "sm" | "md" | "lg" | "xl" | "2xl";
export type Appearance =
  | "primary"
  | "secondary"
  | "warning"
  | "danger"
  | "plain";

export interface UIButtonProps {
  /**
   * Pre-defined button sizes, plus "responsive", which uses Tailwind
   * CSS breakpoints to dynamically adjust the button size.
   *
   * @type {Size}
   */
  size: Size;

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
  text: string;
}

const buttonClasses = (size: Size, appearance: Appearance) =>
  classNames({
    "px-2.5 py-1.5 text-xs rounded md:px-3 md:py-2 md:text-sm md:leading-4 md:rounded-md lg:px-4 xl:text-base 2xl:px-6 2xl:py-3":
      size === "responsive",
    "px-2.5 py-1.5 text-xs rounded": size === "sm",
    "px-3 py-2 text-sm leading-4 rounded-md": size === "md",
    "px-4 py-2 text-sm rounded-md": size === "lg",
    "px-4 py-2 text-base rounded-md": size === "xl",
    "px-6 py-3 text-base rounded-md": size === "2xl",
    "border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500":
      appearance === "primary",
    "border-transparent text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500":
      appearance === "secondary",
    "border-transparent text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500":
      appearance === "warning",
    "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500":
      appearance === "danger",
    "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500":
      appearance === "plain",
    "inline-flex items-center border font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2":
      true,
  });

export const UIButton = (p: UIButtonProps): JSX.Element => (
  <button type="button" className={buttonClasses(p.size, p.appearance)}>
    {p.text}
  </button>
);
