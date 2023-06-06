import type { MouseEventHandler } from "react";

import "@/index.css";

import classNames from "classnames";

export type Appearance = "primary" | "danger";
export type NameStyle = "code" | "prose";
export type Name = {
  text: string;
  style: NameStyle;
};

export type ActionPanelButtonProps = {
  appearance: Appearance;
  name?: Name;
  description?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

type Height = "tall" | "short";

const buttonClasses = (appearance: Appearance, height: Height) =>
  classNames({
    "inline-flex items-center w-full px-3 text-base rounded border font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2":
      true,
    "py-6": height === "tall",
    "py-3": height === "short",
    "border-grey-primary text-blue-primary bg-white-primary hover:bg-blue-primary hover:text-white-primary focus:ring-blue-primary":
      appearance === "primary",
    "border-red-secondary text-white-primary bg-red-secondary hover:bg-red-secondary-hover hover:border-red-secondary-hover focus:ring-red-primary":
      appearance === "danger",
  });

export const ActionPanelButton = (p: ActionPanelButtonProps): JSX.Element => {
  return (
    <button
      type="button"
      className={buttonClasses(
        p.appearance,
        p.name && p.description ? "tall" : "short"
      )}
      onClick={p.onClick}
    >
      {p.name ? (
        <>
          <div
            className={classNames(
              "mr-4 w-8 flex-none",
              p.name.style === "code" ? "block truncate font-code" : "",
              p.description ? "text-left" : "grow text-center"
            )}
            aria-hidden="true"
          >
            {p.name.text}
          </div>
          {p.description && <p className="text-left">{p.description}</p>}
        </>
      ) : (
        p.description && (
          <div className="grow">
            <p className="text-center">{p.description}</p>
          </div>
        )
      )}
    </button>
  );
};

export default ActionPanelButton;
