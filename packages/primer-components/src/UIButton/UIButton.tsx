import "@/index.css";

import classNames from "classnames";

export type Size = "responsive" | "sm" | "md" | "lg" | "xl" | "2xl";
export type Appearance =
  | "primary"
  | "primarylighter"
  | "secondary"
  | "warning"
  | "danger"
  | "dangerlighter"
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
    "border-transparent text-white-primary bg-blue-primary hover:bg-blue-hover1 focus:ring-blue-primary":
      appearance === "primary",
    "border-transparent text-white-primary bg-blue-primary hover:bg-blue-hoverL1 focus:ring-blue-primary":
      appearance === "primarylighter",
    "border-transparent text-white-primary bg-blue-secondary hover:bg-blue-hover2 focus:ring-blue-secondary":
      appearance === "secondary",
    "border-transparent text-white-primary bg-red-secondary hover:bg-red-hover focus:ring-red-secondary":
      appearance === "warning",
    "border-transparent text-white-primary bg-red-primary hover:bg-red-hoverL1 focus:ring-red-primary":
      appearance === "dangerlighter",
    "border-transparent text-white-primary bg-red-primary hover:bg-red-hover focus:ring-red-primary":
      appearance === "danger",
    "border-transparent text-blue-primary bg-grey-primary hover:text-blue-primary hover:bg-grey-hover focus:bg-grey-primary":
      appearance === "plain",
    "inline-flex items-center border font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2":
      true,
  });

export const UIButton = (p: UIButtonProps): JSX.Element => (
  <button type="button" className={buttonClasses(p.size, p.appearance)}>
    {p.text}
  </button>
);
