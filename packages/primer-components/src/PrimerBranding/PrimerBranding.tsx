import "@/index.css";

import classNames from "classnames";

export type Size = "sm" | "md" | "lg" | "xl" | "2xl";

export interface PrimerBrandingProps {
  /**
   * Pre-defined sizes.
   *
   * @type {Size}
   */
  size: Size;
}

const brandingClasses = (size: Size) =>
  classNames({
    "text-sm": size === "sm",
    "text-md": size === "md",
    "text-lg": size === "lg",
    "text-xl": size === "xl",
    "text-2xl": size === "2xl",
    "inline-flex items-center font-medium font-serif text-red-400": true,
  });

export const PrimerBranding = (p: PrimerBrandingProps): JSX.Element => (
  <text className={brandingClasses(p.size)}>Primer</text>
);
