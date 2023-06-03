import "@/index.css";

import { useMemo } from "react";
import type { Style, StyleOptions, Options } from "@dicebear/core";
import { createAvatar } from "@dicebear/core";
import { bottts, identicon } from "@dicebear/collection";
import type { AvatarStyle } from "@/Types";
import classNames from "classnames";

export type Size = "responsive" | "sm" | "md" | "lg" | "xl" | "2xl";
export type Decoration = "plain" | "alert";

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
   * What sort of decoration to show on the avatar image.
   *
   * @type {Decoration}
   */
  decoration: Decoration;

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

const imgClasses = (size: Size) =>
  classNames({
    "h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14":
      size === "responsive",
    "h-6 w-6": size === "sm",
    "h-8 w-8": size === "md",
    "h-10 w-10": size === "lg",
    "h-12 w-12": size === "xl",
    "h-14 w-14": size === "2xl",
    "rounded-full": true,
  });

const decorationClasses = (size: Size, decoration: Decoration) =>
  classNames({
    "h-1.5 w-1.5 md:h-2 md:w-2 lg:h-2.5 lg:w-2.5 xl:h-3 xl:w-3 2xl:h-3.5 2xl:w-3.5":
      size === "responsive",
    "h-1.5 w-1.5": size === "sm",
    "h-2 w-2": size === "md",
    "h-2.5 w-2.5": size === "lg",
    "h-3 w-3": size === "xl",
    "h-3.5 w-3.5": size === "2xl",
    hidden: decoration === "plain",
    "absolute top-0 right-0 block rounded-full ring-2 ring-white-primary bg-red-secondary":
      true,
  });

export const avatarStyle = (
  style: AvatarStyle
): Style<StyleOptions<Options>> => {
  switch (style) {
    case "bottts":
      return bottts;
    case "identicon":
      return identicon;
  }
};

export const avatarOptions = (style: AvatarStyle): StyleOptions<Options> => {
  switch (style) {
    case "bottts":
      // This transformation focuses on the bot face.
      return { radius: 50, scale: 200, translateY: -29 };
    default:
      // Ensure the square icon is circumscribed by the round cutout.
      return { scale: 70 };
  }
};

export const Avatar = (p: AvatarProps): JSX.Element => {
  // React Hooks must be called in the exact same order in every
  // component render, so we can't put this behind the conditional
  // operator below.
  const avatar = useMemo(() => {
    return createAvatar(avatarStyle(p.style), {
      seed: p.id,
      ...avatarOptions(p.style),
    }).toDataUriSync();
  }, [p.id, p.style]);
  const src = p.imgSrc ? p.imgSrc : avatar;

  return (
    <span className="relative inline-block">
      <img className={imgClasses(p.size)} src={src} alt={p.id} />
      <span className={decorationClasses(p.size, p.decoration)} />
    </span>
  );
};

export default Avatar;
