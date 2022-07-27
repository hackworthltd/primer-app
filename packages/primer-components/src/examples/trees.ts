import type { Tree, TreeInteractiveRender } from "@hackworthltd/primer-types";

/*
Some example trees.

It's important that node IDs are unique across all these trees,
as we'd like to render them simultaneously on one canvas.
*/

export const tree1: Tree = {
  nodeId: 100,
  childTrees: [],
  ann: "EmptyHole",
  body: "bod",
  colour: "red",
};

export const tree2: Tree = undefined as unknown as Tree;

export const tree3 = tree2;

export const tree4: Tree = tree2;

export const tree5: TreeInteractiveRender = tree2;
