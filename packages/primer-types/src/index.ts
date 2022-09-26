import { Tree } from "./Tree";

export * from "./Account";
export * from "./Session";
export * from "./Tree";

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
