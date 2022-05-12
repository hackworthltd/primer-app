import type { Tree, TreeInteractiveRender } from "@hackworthltd/primer-types";

export const tree1: Tree = {
  nodeId: 0,
  childTrees: [],
  label: "EmptyHole",
};

export const tree2: Tree = {
  nodeId: 0,
  childTrees: [{ nodeId: 1, childTrees: [], label: "Var x" }],
  label: "Lam x",
};

export const tree3: Tree = {
  nodeId: 0,
  childTrees: [{ nodeId: 1, childTrees: [], label: "Var y" }],
  label: "Lam y",
};

export const tree4: Tree = {
  nodeId: 0,
  childTrees: [
    {
      nodeId: 1,
      childTrees: [
        {
          nodeId: 2,
          childTrees: [
            {
              nodeId: 3,
              childTrees: [{ nodeId: 4, childTrees: [], label: "Var x" }],
              label: "Lam x",
            },
          ],
          label: "LAM a",
        },
        {
          nodeId: 5,
          childTrees: [
            {
              nodeId: 6,
              childTrees: [
                { nodeId: 7, childTrees: [], label: "TVar a" },
                { nodeId: 8, childTrees: [], label: "TVar a" },
              ],
              label: "TFun",
            },
          ],
          label: "TForall",
        },
      ],
      label: "Ann",
    },
    { nodeId: 9, childTrees: [], label: "Con Unit" },
  ],
  label: "App",
};

export const tree5: TreeInteractiveRender = {
  nodeId: 0,
  childTrees: [
    {
      nodeId: 1,
      childTrees: [
        { nodeId: 2, childTrees: [], label: "Var x" },
        { nodeId: 3, childTrees: [], label: "EmptyHole" },
        { nodeId: 6, childTrees: [], label: "EmptyHole" },
      ],
      label: "Case",
    },
  ],
  label: "Lam x",
  onClick: (e) => console.log("Clicked: " + e),
};
