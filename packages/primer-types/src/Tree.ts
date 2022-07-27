import * as React from "react";

/**
 *
 * @export
 * @interface Tree
 */
export interface Tree {
  ann: string;
  body?: string;
  childTrees: Pair[];
  colour: string;
  nodeId: number;
}

export interface Pair {
  fstPair: EitherBoxTree;
  sndPair: ChildDir;
}

export type EitherBoxTree = EitherBoxTreeOneOf | EitherBoxTreeOneOfTwo;
export type EitherBoxTreeOneOf = {
  Left: Box;
};
export type EitherBoxTreeOneOfTwo = {
  Right: Tree;
};
export interface Box {
  ann: string;
  childTrees: Pair[];
  colour: string;
  inside: Tree;
}
export type ChildDir = typeof ChildDir[keyof typeof ChildDir];
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ChildDir = {
  ChildLeft: "ChildLeft",
  ChildRight: "ChildRight",
  ChildBottom: "ChildBottom",
} as const;

/**
 * TreeInteractiveRender is like Tree, but has added information for frontend
 * purposes. We add some click handlers, primarily to help visualise how trees
 * dynamically respond to nodes being added and removed. This is only intended
 * for development use, since 'onRightClick' (which is intended to be
 * implemented via 'oncontextmenu') is not usable across all touch/mobile
 * devices.
 *
 * @export
 * @interface TreeInteractiveRender
 */

export interface TreeInteractiveRender {
  ann: string;
  body?: string;
  childTrees: Pair[];
  colour: string;
  nodeId: number;

  /**
   *
   * @type {React.MouseEventHandler<unknown>}
   * @memberof Tree
   */
  onClick?: React.MouseEventHandler<unknown>;
  /**
   *
   * @type {React.MouseEventHandler<unknown>}
   * @memberof Tree
   */
  onRightClick?: React.MouseEventHandler<unknown>;
}
