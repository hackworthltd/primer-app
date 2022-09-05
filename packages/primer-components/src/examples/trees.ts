import type { Tree, TreeInteractiveRender } from "@hackworthltd/primer-types";

/*
Some example trees.

It's important that node IDs are unique across all the numbered trees,
as we'd like to render them simultaneously on one canvas.
*/

export const tree1: Tree = {
  body: { tag: "NoBody" },
  childTrees: [],
  flavor: "FlavorEmptyHole",
  nodeId: "100",
};

export const tree2: Tree = {
  body: { tag: "TextBody", contents: "x" },
  childTrees: [
    {
      body: { tag: "TextBody", contents: "x" },
      childTrees: [],
      flavor: "FlavorLocalVar",
      nodeId: "201",
    },
  ],
  flavor: "FlavorLam",
  nodeId: "200",
};

export const tree3: Tree = {
  body: { tag: "TextBody", contents: "y" },
  childTrees: [
    {
      body: { tag: "TextBody", contents: "y" },
      childTrees: [],
      flavor: "FlavorLocalVar",
      nodeId: "301",
    },
  ],
  flavor: "FlavorLam",
  nodeId: "300",
};

export const tree4: Tree = {
  body: { tag: "NoBody" },
  childTrees: [
    {
      body: { tag: "NoBody" },
      childTrees: [
        {
          body: { tag: "TextBody", contents: "a" },
          childTrees: [
            {
              body: { tag: "TextBody", contents: "x" },
              childTrees: [
                {
                  body: { tag: "TextBody", contents: "x" },
                  childTrees: [],
                  flavor: "FlavorLocalVar",
                  nodeId: "404",
                },
              ],
              flavor: "FlavorLam",
              nodeId: "403",
            },
          ],
          flavor: "FlavorLAM",
          nodeId: "402",
        },
        {
          body: { tag: "TextBody", contents: "a" },
          childTrees: [
            {
              body: { tag: "NoBody" },
              childTrees: [
                {
                  body: { tag: "TextBody", contents: "a" },
                  childTrees: [],
                  flavor: "FlavorTVar",
                  nodeId: "407",
                },
                {
                  body: { tag: "TextBody", contents: "a" },
                  childTrees: [],
                  flavor: "FlavorTVar",
                  nodeId: "408",
                },
              ],
              flavor: "FlavorTFun",
              nodeId: "406",
            },
          ],
          flavor: "FlavorTForall",
          nodeId: "405",
        },
      ],
      flavor: "FlavorAnn",
      nodeId: "401",
    },
    {
      body: { tag: "TextBody", contents: "Unit" },
      childTrees: [],
      flavor: "FlavorCon",
      nodeId: "409",
    },
  ],
  flavor: "FlavorApp",
  nodeId: "400",
};

export const tree5: TreeInteractiveRender = {
  body: { tag: "TextBody", contents: "x" },
  childTrees: [
    {
      body: { tag: "NoBody" },
      childTrees: [
        {
          body: { tag: "TextBody", contents: "x" },
          childTrees: [],
          flavor: "FlavorLocalVar",
          nodeId: "502",
        },
        {
          body: { tag: "NoBody" },
          childTrees: [],
          flavor: "FlavorEmptyHole",
          nodeId: "503",
        },
        {
          body: { tag: "NoBody" },
          childTrees: [],
          flavor: "FlavorEmptyHole",
          nodeId: "506",
        },
      ],
      flavor: "FlavorCase",
      nodeId: "501",
    },
  ],
  flavor: "FlavorLam",
  nodeId: "500",
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
            flavor: "FlavorLocalVar",
            nodeId: "5",
          },
          {
            body: { tag: "NoBody" },
            childTrees: [
              {
                body: {
                  contents: {
                    body: { contents: "Builtins.Zero", tag: "TextBody" },
                    childTrees: [],
                    flavor: "FlavorPatternCon",
                    nodeId: "4P0B",
                  },
                  tag: "BoxBody",
                },
                childTrees: [
                  {
                    body: { contents: "Builtins.True", tag: "TextBody" },
                    childTrees: [],
                    flavor: "FlavorCon",
                    nodeId: "6",
                  },
                ],
                flavor: "FlavorPattern",
                nodeId: "4P0",
              },
              {
                body: {
                  contents: {
                    body: { tag: "NoBody" },
                    childTrees: [
                      {
                        body: { contents: "Builtins.Succ", tag: "TextBody" },
                        childTrees: [],
                        flavor: "FlavorPatternCon",
                        nodeId: "4P1B",
                      },
                      {
                        body: { contents: "n", tag: "TextBody" },
                        childTrees: [],
                        flavor: "FlavorPatternBind",
                        nodeId: "7",
                      },
                    ],
                    flavor: "FlavorPatternApp",
                    nodeId: "7A",
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
                        flavor: "FlavorGlobalVar",
                        nodeId: "9",
                      },
                      {
                        body: { contents: "n", tag: "TextBody" },
                        childTrees: [],
                        flavor: "FlavorLocalVar",
                        nodeId: "10",
                      },
                    ],
                    flavor: "FlavorApp",
                    nodeId: "8",
                  },
                ],
                flavor: "FlavorPattern",
                nodeId: "4P1",
              },
            ],
            flavor: "FlavorCaseWith",
            nodeId: "4W",
          },
        ],
        flavor: "FlavorCase",
        nodeId: "4",
      },
    ],
    flavor: "FlavorLam",
    nodeId: "3",
  },
  {
    body: { tag: "NoBody" },
    childTrees: [
      {
        body: { contents: "Even3.even", tag: "TextBody" },
        childTrees: [],
        flavor: "FlavorGlobalVar",
        nodeId: "24",
      },
      {
        body: { tag: "NoBody" },
        childTrees: [
          {
            body: { contents: "Builtins.Succ", tag: "TextBody" },
            childTrees: [],
            flavor: "FlavorCon",
            nodeId: "26",
          },
          {
            body: { tag: "NoBody" },
            childTrees: [
              {
                body: { contents: "Builtins.Succ", tag: "TextBody" },
                childTrees: [],
                flavor: "FlavorCon",
                nodeId: "28",
              },
              {
                body: { tag: "NoBody" },
                childTrees: [
                  {
                    body: { contents: "Builtins.Succ", tag: "TextBody" },
                    childTrees: [],
                    flavor: "FlavorCon",
                    nodeId: "30",
                  },
                  {
                    body: { contents: "Builtins.Zero", tag: "TextBody" },
                    childTrees: [],
                    flavor: "FlavorCon",
                    nodeId: "31",
                  },
                ],
                flavor: "FlavorApp",
                nodeId: "29",
              },
            ],
            flavor: "FlavorApp",
            nodeId: "27",
          },
        ],
        flavor: "FlavorApp",
        nodeId: "25",
      },
    ],
    flavor: "FlavorApp",
    nodeId: "23",
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
            flavor: "FlavorLocalVar",
            nodeId: "16",
          },
          {
            body: { tag: "NoBody" },
            childTrees: [
              {
                body: {
                  contents: {
                    body: { contents: "Builtins.Zero", tag: "TextBody" },
                    childTrees: [],
                    flavor: "FlavorPatternCon",
                    nodeId: "15P0B",
                  },
                  tag: "BoxBody",
                },
                childTrees: [
                  {
                    body: { contents: "Builtins.False", tag: "TextBody" },
                    childTrees: [],
                    flavor: "FlavorCon",
                    nodeId: "17",
                  },
                ],
                flavor: "FlavorPattern",
                nodeId: "15P0",
              },
              {
                body: {
                  contents: {
                    body: {
                      tag: "NoBody",
                    },
                    childTrees: [
                      {
                        body: { contents: "Builtins.Succ", tag: "TextBody" },
                        childTrees: [],
                        flavor: "FlavorPatternCon",
                        nodeId: "15P1B",
                      },
                      {
                        body: { contents: "n", tag: "TextBody" },
                        childTrees: [],
                        flavor: "FlavorPatternBind",
                        nodeId: "18",
                      },
                    ],
                    flavor: "FlavorPatternApp",
                    nodeId: "18A",
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
                        flavor: "FlavorGlobalVar",
                        nodeId: "20",
                      },
                      {
                        body: { contents: "n", tag: "TextBody" },
                        childTrees: [],
                        flavor: "FlavorLocalVar",
                        nodeId: "21",
                      },
                    ],
                    flavor: "FlavorApp",
                    nodeId: "19",
                  },
                ],
                flavor: "FlavorPattern",
                nodeId: "15P1",
              },
            ],
            flavor: "FlavorCaseWith",
            nodeId: "15W",
          },
        ],
        flavor: "FlavorCase",
        nodeId: "15",
      },
    ],
    flavor: "FlavorLam",
    nodeId: "14",
  },
];

export const oddEvenTreesMiscStyles: Tree[] = [
  {
    body: { contents: "x", tag: "TextBody" },
    childTrees: [
      {
        body: { tag: "NoBody" },
        childTrees: [
          {
            body: { contents: "x", tag: "TextBody" },
            childTrees: [],
            flavor: "FlavorLocalVar",
            nodeId: "5",
          },
        ],
        flavor: "FlavorCase",
        nodeId: "4",
        rightChild: {
          body: {
            contents: {
              body: { contents: "Builtins.Zero", tag: "TextBody" },
              childTrees: [],
              flavor: "FlavorPatternCon",
              nodeId: "4P0B",
            },
            tag: "BoxBody",
          },
          childTrees: [
            {
              body: { contents: "Builtins.True", tag: "TextBody" },
              childTrees: [],
              flavor: "FlavorCon",
              nodeId: "6",
            },
          ],
          flavor: "FlavorPattern",
          nodeId: "4P0",
          rightChild: {
            body: {
              contents: {
                body: { tag: "NoBody" },
                childTrees: [
                  {
                    body: { contents: "Builtins.Succ", tag: "TextBody" },
                    childTrees: [],
                    flavor: "FlavorPatternCon",
                    nodeId: "4P1B",
                  },
                  {
                    body: { contents: "n", tag: "TextBody" },
                    childTrees: [],
                    flavor: "FlavorPatternBind",
                    nodeId: "7",
                  },
                ],
                flavor: "FlavorPatternApp",
                nodeId: "7A",
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
                    flavor: "FlavorGlobalVar",
                    nodeId: "9",
                  },
                  {
                    body: { contents: "n", tag: "TextBody" },
                    childTrees: [],
                    flavor: "FlavorLocalVar",
                    nodeId: "10",
                  },
                ],
                flavor: "FlavorApp",
                nodeId: "8",
              },
            ],
            flavor: "FlavorPattern",
            nodeId: "4P1",
          },
        },
      },
    ],
    flavor: "FlavorLam",
    nodeId: "3",
  },
  {
    body: { tag: "NoBody" },
    childTrees: [
      {
        body: { contents: "Even3.even", tag: "TextBody" },
        childTrees: [],
        flavor: "FlavorGlobalVar",
        nodeId: "24",
      },
      {
        body: { tag: "NoBody" },
        childTrees: [
          {
            body: { contents: "Builtins.Succ", tag: "TextBody" },
            childTrees: [],
            flavor: "FlavorCon",
            nodeId: "26",
          },
          {
            body: { tag: "NoBody" },
            childTrees: [
              {
                body: { contents: "Builtins.Succ", tag: "TextBody" },
                childTrees: [],
                flavor: "FlavorCon",
                nodeId: "28",
              },
              {
                body: { tag: "NoBody" },
                childTrees: [
                  {
                    body: { contents: "Builtins.Succ", tag: "TextBody" },
                    childTrees: [],
                    flavor: "FlavorCon",
                    nodeId: "30",
                  },
                  {
                    body: { contents: "Builtins.Zero", tag: "TextBody" },
                    childTrees: [],
                    flavor: "FlavorCon",
                    nodeId: "31",
                  },
                ],
                flavor: "FlavorApp",
                nodeId: "29",
              },
            ],
            flavor: "FlavorApp",
            nodeId: "27",
          },
        ],
        flavor: "FlavorApp",
        nodeId: "25",
      },
    ],
    flavor: "FlavorApp",
    nodeId: "23",
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
            flavor: "FlavorLocalVar",
            nodeId: "16",
          },
        ],
        flavor: "FlavorCase",
        nodeId: "15",
        rightChild: {
          body: {
            contents: {
              body: { contents: "Builtins.Zero", tag: "TextBody" },
              childTrees: [],
              flavor: "FlavorPatternCon",
              nodeId: "15P0B",
            },
            tag: "BoxBody",
          },
          childTrees: [
            {
              body: { contents: "Builtins.False", tag: "TextBody" },
              childTrees: [],
              flavor: "FlavorCon",
              nodeId: "17",
            },
          ],
          flavor: "FlavorPattern",
          nodeId: "15P0",
          rightChild: {
            body: {
              contents: {
                body: { contents: "Builtins.Succ", tag: "TextBody" },
                childTrees: [
                  {
                    body: { contents: "n", tag: "TextBody" },
                    childTrees: [],
                    flavor: "FlavorPatternBind",
                    nodeId: "18",
                  },
                ],
                flavor: "FlavorPatternCon",
                nodeId: "15P1B",
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
                    flavor: "FlavorGlobalVar",
                    nodeId: "20",
                  },
                  {
                    body: { contents: "n", tag: "TextBody" },
                    childTrees: [],
                    flavor: "FlavorLocalVar",
                    nodeId: "21",
                  },
                ],
                flavor: "FlavorApp",
                nodeId: "19",
              },
            ],
            flavor: "FlavorPattern",
            nodeId: "15P1",
          },
        },
      },
    ],
    flavor: "FlavorLam",
    nodeId: "14",
  },
];
