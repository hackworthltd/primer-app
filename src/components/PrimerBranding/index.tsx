import "@/index.css";

import classNames from "classnames";

export type Size = "responsive" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface PrimerBrandingProps {
  /**
   * Pre-defined sizes, plus "responsive", which uses Tailwind CSS
   * breakpoints to dynamically adjust the branding size.
   *
   * @type {Size}
   */
  size: Size;
}

const brandingClasses = (size: Size) =>
  classNames({
    "text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl":
      size === "responsive",
    "text-sm": size === "sm",
    "text-md": size === "md",
    "text-lg": size === "lg",
    "text-xl": size === "xl",
    "text-2xl": size === "2xl",
    "inline-flex items-center font-medium font-serif text-red-secondary": true,
  });

export const PrimerBranding = (p: PrimerBrandingProps): JSX.Element => (
  <text className={brandingClasses(p.size)}>Primer</text>
);

export default PrimerBranding;
