import "@/index.css";

import { BellIcon } from "@heroicons/react/outline";
import classNames from "classnames";

export type Appearance = "plain" | "notifications";

export interface NotificationsButtonProps {
  /**
   * Pre-defined button appearances.
   *
   * @type {Appearance}
   */
  appearance: Appearance;
}

const iconClasses = (appearance: Appearance) =>
  classNames({
    // In Tailwind, note that in order to define different stroke and
    // fill colors on the same SVG, we need to make use of Tailwind's
    // themes, which is what we've done below via the
    // "stroke-blue-primary" class. See:
    //
    // https://github.com/tailwindlabs/tailwindcss/issues/2024
    //
    // XXX dhess: I think we need a tertiary blue/red to make this work in
    // notification mode.
    "stroke-grey-primary fill-current text-red-secondary hover:stroke-grey-primary hover:text-red-primary":
      appearance === "notifications",
    // XXX dhess: our primary grey is a bit too light here, but our
    // secondary and tertiary are too dark.
    "stroke-grey-primary fill-current text-white-primary hover:stroke-grey-secondary hover:text-blue-secondary":
      appearance === "plain",
    "w-6 h-6": true,
  });

export const NotificationsButton = (
  p: NotificationsButtonProps
): JSX.Element => (
  <button
    type="button"
    className="shrink-0 p-1 ml-5 bg-white-primary rounded-full focus:outline-none focus:ring-2 focus:ring-blue-primary focus:ring-offset-2 md:ml-auto"
  >
    <span className="sr-only">View notifications</span>
    <BellIcon className={iconClasses(p.appearance)} aria-hidden="true" />
  </button>
);
