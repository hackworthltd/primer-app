import type { Tree, TreeInteractiveRender } from "@hackworthltd/primer-types";

/*
Some example trees.

It's important that node IDs are unique across all these trees,
as we'd like to render them simultaneously on one canvas.
*/

export const tree1: Tree = {
  nodeId: 100,
  childTrees: [],
  label: "EmptyHole",
};

export const tree2: Tree = {
  nodeId: 200,
  childTrees: [{ nodeId: 201, childTrees: [], label: "Var x" }],
  label: "Lam x",
};

export const tree3: Tree = {
  nodeId: 300,
  childTrees: [{ nodeId: 301, childTrees: [], label: "Var y" }],
  label: "Lam y",
};

export const tree4: Tree = {
  nodeId: 400,
  childTrees: [
    {
      nodeId: 401,
      childTrees: [
        {
          nodeId: 402,
          childTrees: [
            {
              nodeId: 403,
              childTrees: [{ nodeId: 404, childTrees: [], label: "Var x" }],
              label: "Lam x",
            },
          ],
          label: "LAM a",
        },
        {
          nodeId: 405,
          childTrees: [
            {
              nodeId: 406,
              childTrees: [
                { nodeId: 407, childTrees: [], label: "TVar a" },
                { nodeId: 408, childTrees: [], label: "TVar a" },
              ],
              label: "TFun",
            },
          ],
          label: "TForall",
        },
      ],
      label: "Ann",
    },
    { nodeId: 409, childTrees: [], label: "Con Unit" },
  ],
  label: "App",
};

export const tree5: TreeInteractiveRender = {
  nodeId: 500,
  childTrees: [
    {
      nodeId: 501,
      childTrees: [
        { nodeId: 502, childTrees: [], label: "Var x" },
        { nodeId: 503, childTrees: [], label: "EmptyHole" },
        { nodeId: 506, childTrees: [], label: "EmptyHole" },
      ],
      label: "Case",
    },
  ],
  label: "Lam x",
  onClick: (e) => console.log("Clicked: " + e),
};
