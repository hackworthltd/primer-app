export * from "./Account";
export * from "./Session";
export * from "./Tree";

export type OfferedAction = {
  actionType: ActionType;
  description: string;
  name: { tag: "Code"; contents: string } | { tag: "Prose"; contents: string };
  priority: number;
};
export type ActionType = "Primary" | "Destructive";
