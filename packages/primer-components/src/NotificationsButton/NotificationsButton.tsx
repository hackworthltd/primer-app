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
    // "stroke-indigo-700" class. See:
    //
    // https://github.com/tailwindlabs/tailwindcss/issues/2024
    "stroke-indigo-300 fill-current text-indigo-600 hover:text-indigo-700":
      appearance === "notifications",
    "text-gray-400 hover:text-gray-500 ": appearance === "plain",
    "w-6 h-6": true,
  });

export const NotificationsButton = (
  p: NotificationsButtonProps
): JSX.Element => (
  <button
    type="button"
    className="flex-shrink-0 p-1 ml-5 md:ml-auto bg-white rounded-full focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
  >
    <span className="sr-only">View notifications</span>
    <BellIcon className={iconClasses(p.appearance)} aria-hidden="true" />
  </button>
);
