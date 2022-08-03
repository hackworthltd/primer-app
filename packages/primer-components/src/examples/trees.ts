import type { Tree, TreeInteractiveRender } from "@hackworthltd/primer-types";

/*
Some example trees.

It's important that node IDs are unique across all the numbered trees,
as we'd like to render them simultaneously on one canvas.
*/

export const tree1: Tree = {
  nodeId: "100",
  childTrees: [],
  flavor: "FlavorEmptyHole",
  body: { tag: "NoBody" },
};

export const tree2: Tree = {
  nodeId: "200",
  childTrees: [
    {
      nodeId: "201",
      childTrees: [],
      flavor: "FlavorLocalVar",
      body: { tag: "TextBody", contents: "x" },
    },
  ],
  flavor: "FlavorLam",
  body: { tag: "TextBody", contents: "x" },
};

export const tree3: Tree = {
  nodeId: "300",
  childTrees: [
    {
      nodeId: "301",
      childTrees: [],
      flavor: "FlavorLocalVar",
      body: { tag: "TextBody", contents: "y" },
    },
  ],
  flavor: "FlavorLam",
  body: { tag: "TextBody", contents: "y" },
};

export const tree4: Tree = {
  nodeId: "400",
  childTrees: [
    {
      nodeId: "401",
      childTrees: [
        {
          nodeId: "402",
          childTrees: [
            {
              nodeId: "403",
              childTrees: [
                {
                  nodeId: "404",
                  childTrees: [],
                  flavor: "FlavorLocalVar",
                  body: { tag: "TextBody", contents: "x" },
                },
              ],
              flavor: "FlavorLam",
              body: { tag: "TextBody", contents: "x" },
            },
          ],
          flavor: "FlavorLAM",
          body: { tag: "TextBody", contents: "a" },
        },
        {
          nodeId: "405",
          childTrees: [
            {
              nodeId: "406",
              childTrees: [
                {
                  nodeId: "407",
                  childTrees: [],
                  flavor: "FlavorTVar",
                  body: { tag: "TextBody", contents: "a" },
                },
                {
                  nodeId: "408",
                  childTrees: [],
                  flavor: "FlavorTVar",
                  body: { tag: "TextBody", contents: "a" },
                },
              ],
              flavor: "FlavorTFun",
              body: { tag: "NoBody" },
            },
          ],
          flavor: "FlavorTForall",
          body: { tag: "NoBody" },
        },
      ],
      flavor: "FlavorAnn",
      body: { tag: "NoBody" },
    },
    {
      nodeId: "409",
      childTrees: [],
      flavor: "FlavorCon",
      body: { tag: "TextBody", contents: "Unit" },
    },
  ],
  flavor: "FlavorApp",
  body: { tag: "NoBody" },
};

export const tree5: TreeInteractiveRender = {
  nodeId: "500",
  childTrees: [
    {
      nodeId: "501",
      childTrees: [
        {
          nodeId: "502",
          childTrees: [],
          flavor: "FlavorLocalVar",
          body: { tag: "TextBody", contents: "x" },
        },
        {
          nodeId: "503",
          childTrees: [],
          flavor: "FlavorEmptyHole",
          body: { tag: "NoBody" },
        },
        {
          nodeId: "506",
          childTrees: [],
          flavor: "FlavorEmptyHole",
          body: { tag: "NoBody" },
        },
      ],
      flavor: "FlavorCase",
      body: { tag: "NoBody" },
    },
  ],
  flavor: "FlavorLam",
  body: { tag: "TextBody", contents: "x" },
  onClick: (e) => console.log("Clicked: " + e),
};
