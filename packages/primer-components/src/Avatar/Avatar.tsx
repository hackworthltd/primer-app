import "@/index.css";

import { useMemo } from "react";
import type { Style, StyleOptions, Options } from "@dicebear/avatars";
import { createAvatar } from "@dicebear/avatars";
import * as bottts from "@dicebear/avatars-bottts-sprites";
import * as identicon from "@dicebear/avatars-identicon-sprites";
import * as jdenticon from "@dicebear/avatars-jdenticon-sprites";
import classNames from "classnames";

export type Size = "responsive" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarStyle = "bottts" | "identicon" | "jdenticon";

export interface AvatarProps {
  /**
   * The student's identifying string. This could be a username, an email address, etc.
   */
  id: string;

  /**
   * The student's chosen avatar style.
   *
   * @type {AvatarStyle}
   */
  style: AvatarStyle;

  /**
   * A student-provided image source. This may be undefined if the student hasn't uploaded one.
   *
   * @type {string | undefined}
   */
  imgSrc: string | undefined;

  /**
   * Pre-defined avatar sizes, plus "responsive", which uses Tailwind
   * CSS breakpoints to dynamically adjust the avatar size.
   *
   * @type {Size}
   */
  size: Size;
}

const imgClasses = (size: Size, imgSrc: string | undefined) =>
  classNames({
    "h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14":
      size === "responsive",
    "h-6 w-6": size === "sm",
    "h-8 w-8": size === "md",
    "h-10 w-10": size === "lg",
    "h-12 w-12": size === "xl",
    "h-14 w-14": size === "2xl",
    "rounded-md": imgSrc !== undefined,
  });

export const avatarStyle = (
  style: AvatarStyle
): Style<StyleOptions<Options>> => {
  switch (style) {
    case "bottts":
      return bottts;
    case "identicon":
      return identicon;
    case "jdenticon":
      return jdenticon;
  }
};

export const Avatar = (p: AvatarProps): JSX.Element => {
  // React Hooks must be called in the exact same order in every
  // component render, so we can't put this behind the conditional
  // operator below.
  const avatar = useMemo(() => {
    return createAvatar(avatarStyle(p.style), {
      seed: p.id,
      dataUri: true,
    });
  }, [p.id, p.style]);
  const src = p.imgSrc ? p.imgSrc : avatar;
  return (
    <span className="inline-block">
      <img className={imgClasses(p.size, p.imgSrc)} src={src} alt={p.id} />
    </span>
  );
};
