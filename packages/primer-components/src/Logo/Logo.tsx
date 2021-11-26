import "@/index.css";

import classNames from "classnames";

import LogoSvg from "./logo.svg?component";

export interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
}

const logoClasses = (size: string) =>
  classNames({
    "w-96 h-96": size === "xl",
    "w-48 h-48": size === "lg",
    "w-16 h-16": size === "md",
    "w-12 h-12": size === "sm",
    "fill-current animate-spin-slow": true,
  });

export const Logo = ({ size = "lg" }: LogoProps): JSX.Element => (
  <div className="text-blue-300">
    <LogoSvg className={logoClasses(size)} />
  </div>
);
