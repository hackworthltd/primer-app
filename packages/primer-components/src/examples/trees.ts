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

export const oddEvenTrees: Tree[] = [
  {
    body: { contents: "x", tag: "TextBody" },
    childTrees: [
      {
        body: { tag: "NoBody" },
        childTrees: [
          {
            body: { contents: "x", tag: "TextBody" },
            childTrees: [],
            nodeId: "5",
            flavor: "FlavorLocalVar",
          },
        ],
        nodeId: "4",
        rightChild: {
          body: {
            contents: {
              body: { contents: "Builtins.Zero", tag: "TextBody" },
              childTrees: [],
              nodeId: "4P0B",
              flavor: "FlavorCon",
            },
            tag: "BoxBody",
          },
          childTrees: [
            {
              body: { contents: "Builtins.True", tag: "TextBody" },
              childTrees: [],
              nodeId: "6",
              flavor: "FlavorCon",
            },
          ],
          nodeId: "4P0",
          rightChild: {
            body: {
              contents: {
                body: { contents: "Builtins.Succ", tag: "TextBody" },
                childTrees: [
                  {
                    body: { contents: "n", tag: "TextBody" },
                    childTrees: [],
                    nodeId: "7",
                    flavor: "FlavorLocalVar",
                  },
                ],
                nodeId: "4P1B",
                flavor: "FlavorCon",
              },
              tag: "BoxBody",
            },
            childTrees: [
              {
                body: { tag: "NoBody" },
                childTrees: [
                  {
                    body: { contents: "Even3.odd", tag: "TextBody" },
                    childTrees: [],
                    nodeId: "9",
                    flavor: "FlavorGlobalVar",
                  },
                  {
                    body: { contents: "n", tag: "TextBody" },
                    childTrees: [],
                    nodeId: "10",
                    flavor: "FlavorLocalVar",
                  },
                ],
                nodeId: "8",
                flavor: "FlavorApp",
              },
            ],
            nodeId: "4P1",
            flavor: "FlavorPattern",
          },
          flavor: "FlavorPattern",
        },
        flavor: "FlavorCase",
      },
    ],
    nodeId: "3",
    flavor: "FlavorLam",
  },
  {
    body: { tag: "NoBody" },
    childTrees: [
      {
        body: { contents: "Even3.even", tag: "TextBody" },
        childTrees: [],
        nodeId: "24",
        flavor: "FlavorGlobalVar",
      },
      {
        body: { tag: "NoBody" },
        childTrees: [
          {
            body: { contents: "Builtins.Succ", tag: "TextBody" },
            childTrees: [],
            nodeId: "26",
            flavor: "FlavorCon",
          },
          {
            body: { tag: "NoBody" },
            childTrees: [
              {
                body: { contents: "Builtins.Succ", tag: "TextBody" },
                childTrees: [],
                nodeId: "28",
                flavor: "FlavorCon",
              },
              {
                body: { tag: "NoBody" },
                childTrees: [
                  {
                    body: { contents: "Builtins.Succ", tag: "TextBody" },
                    childTrees: [],
                    nodeId: "30",
                    flavor: "FlavorCon",
                  },
                  {
                    body: { contents: "Builtins.Zero", tag: "TextBody" },
                    childTrees: [],
                    nodeId: "31",
                    flavor: "FlavorCon",
                  },
                ],
                nodeId: "29",
                flavor: "FlavorApp",
              },
            ],
            nodeId: "27",
            flavor: "FlavorApp",
          },
        ],
        nodeId: "25",
        flavor: "FlavorApp",
      },
    ],
    nodeId: "23",
    flavor: "FlavorApp",
  },
  {
    body: { contents: "x", tag: "TextBody" },
    childTrees: [
      {
        body: { tag: "NoBody" },
        childTrees: [
          {
            body: { contents: "x", tag: "TextBody" },
            childTrees: [],
            nodeId: "16",
            flavor: "FlavorLocalVar",
          },
        ],
        nodeId: "15",
        rightChild: {
          body: {
            contents: {
              body: { contents: "Builtins.Zero", tag: "TextBody" },
              childTrees: [],
              nodeId: "15P0B",
              flavor: "FlavorCon",
            },
            tag: "BoxBody",
          },
          childTrees: [
            {
              body: { contents: "Builtins.False", tag: "TextBody" },
              childTrees: [],
              nodeId: "17",
              flavor: "FlavorCon",
            },
          ],
          nodeId: "15P0",
          rightChild: {
            body: {
              contents: {
                body: { contents: "Builtins.Succ", tag: "TextBody" },
                childTrees: [
                  {
                    body: { contents: "n", tag: "TextBody" },
                    childTrees: [],
                    nodeId: "18",
                    flavor: "FlavorLocalVar",
                  },
                ],
                nodeId: "15P1B",
                flavor: "FlavorCon",
              },
              tag: "BoxBody",
            },
            childTrees: [
              {
                body: { tag: "NoBody" },
                childTrees: [
                  {
                    body: { contents: "Even3.even", tag: "TextBody" },
                    childTrees: [],
                    nodeId: "20",
                    flavor: "FlavorGlobalVar",
                  },
                  {
                    body: { contents: "n", tag: "TextBody" },
                    childTrees: [],
                    nodeId: "21",
                    flavor: "FlavorLocalVar",
                  },
                ],
                nodeId: "19",
                flavor: "FlavorApp",
              },
            ],
            nodeId: "15P1",
            flavor: "FlavorPattern",
          },
          flavor: "FlavorPattern",
        },
        flavor: "FlavorCase",
      },
    ],
    nodeId: "14",
    flavor: "FlavorLam",
  },
];
