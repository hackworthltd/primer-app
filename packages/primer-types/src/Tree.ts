import * as React from "react";

/**
 *
 * @export
 * @interface Tree
 */
export interface Tree {
  body: NodeBody;
  childTrees: Tree[];
  label: string;
  nodeId: string;
  rightChild?: Tree;
  style: NodeStyle;
}

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
  body: NodeBody;
  childTrees: Tree[];
  label: string;
  nodeId: string;
  rightChild?: Tree;
  style: NodeStyle;
  onClick?: React.MouseEventHandler<unknown>;
  /**
   *
   * @type {React.MouseEventHandler<unknown>}
   * @memberof Tree
   */
  onRightClick?: React.MouseEventHandler<unknown>;
}

export type NodeBody = NodeBodyOneOf | NodeBodyOneOfThree | NodeBodyOneOfFive;
export type NodeBodyOneOf = {
  contents: string;
  tag: NodeBodyOneOfTag;
};
export type NodeBodyOneOfFive = {
  tag: NodeBodyOneOfFiveTag;
};
export type NodeBodyOneOfFiveTag =
  typeof NodeBodyOneOfFiveTag[keyof typeof NodeBodyOneOfFiveTag];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const NodeBodyOneOfFiveTag = {
  NoBody: "NoBody",
} as const;
export type NodeBodyOneOfTag =
  typeof NodeBodyOneOfTag[keyof typeof NodeBodyOneOfTag];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const NodeBodyOneOfTag = {
  TextBody: "TextBody",
} as const;
export type NodeBodyOneOfThree = {
  contents: Tree;
  tag: NodeBodyOneOfThreeTag;
};
export type NodeBodyOneOfThreeTag =
  typeof NodeBodyOneOfThreeTag[keyof typeof NodeBodyOneOfThreeTag];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const NodeBodyOneOfThreeTag = {
  BoxBody: "BoxBody",
} as const;
export type NodeStyle = typeof NodeStyle[keyof typeof NodeStyle];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const NodeStyle = {
  StyleHole: "StyleHole",
  StyleEmptyHole: "StyleEmptyHole",
  StyleAnn: "StyleAnn",
  StyleApp: "StyleApp",
  StyleAPP: "StyleAPP",
  StyleCon: "StyleCon",
  StyleLam: "StyleLam",
  StyleLAM: "StyleLAM",
  StyleVar: "StyleVar",
  StyleGlobalVarRef: "StyleGlobalVarRef",
  StyleLocalVarRef: "StyleLocalVarRef",
  StyleLet: "StyleLet",
  StyleLetType: "StyleLetType",
  StyleLetrec: "StyleLetrec",
  StyleCase: "StyleCase",
  StylePrimCon: "StylePrimCon",
  StyleTEmptyHole: "StyleTEmptyHole",
  StyleTHole: "StyleTHole",
  StyleTCon: "StyleTCon",
  StyleTFun: "StyleTFun",
  StyleTVar: "StyleTVar",
  StyleTApp: "StyleTApp",
  StyleTForall: "StyleTForall",
  StylePattern: "StylePattern",
} as const;
