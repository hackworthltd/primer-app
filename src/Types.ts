export interface Def {
  name: GlobalName;
  term?: Tree;
  type_: Tree;
}
export type GlobalName = {
  baseName: string;
  qualifiedModule: string[];
};

export type OfferedAction = {
  actionType: ActionType;
  description: string;
  name: { tag: "Code"; contents: string } | { tag: "Prose"; contents: string };
  priority: number;
};
export type ActionType = "Primary" | "Destructive";

export type NodeType = "BodyNode" | "SigNode";

// Abstract avatar styles.
export type AvatarStyle = "bottts" | "identicon" | "jdenticon";

// Placeholder account type.
export interface Account {
  name: string;
  email: string;
  avatarStyle: AvatarStyle;
  imageUrl: string | undefined;
}

// Placeholder type for our backend session type.
export interface SessionMeta {
  id: string;
  name: string;
  lastModified: Date;
}

/**
 *
 * @export
 * @interface Tree
 */
export interface Tree {
  body: NodeBody;
  childTrees: Tree[];
  nodeId: string;
  rightChild?: Tree;
  flavor: NodeFlavor;
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
export type NodeFlavor = typeof NodeFlavor[keyof typeof NodeFlavor];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const NodeFlavor = {
  FlavorHole: "FlavorHole",
  FlavorEmptyHole: "FlavorEmptyHole",
  FlavorAnn: "FlavorAnn",
  FlavorApp: "FlavorApp",
  FlavorAPP: "FlavorAPP",
  FlavorCon: "FlavorCon",
  FlavorLam: "FlavorLam",
  FlavorLAM: "FlavorLAM",
  FlavorGlobalVar: "FlavorGlobalVar",
  FlavorLocalVar: "FlavorLocalVar",
  FlavorLet: "FlavorLet",
  FlavorLetType: "FlavorLetType",
  FlavorLetrec: "FlavorLetrec",
  FlavorCase: "FlavorCase",
  FlavorCaseWith: "FlavorCaseWith",
  FlavorPrimCon: "FlavorPrimCon",
  FlavorTEmptyHole: "FlavorTEmptyHole",
  FlavorTHole: "FlavorTHole",
  FlavorTCon: "FlavorTCon",
  FlavorTFun: "FlavorTFun",
  FlavorTVar: "FlavorTVar",
  FlavorTApp: "FlavorTApp",
  FlavorTForall: "FlavorTForall",
  FlavorTLet: "FlavorTLet",
  FlavorPattern: "FlavorPattern",
  FlavorPatternCon: "FlavorPatternCon",
  FlavorPatternBind: "FlavorPatternBind",
  FlavorPatternApp: "FlavorPatternApp",
} as const;
