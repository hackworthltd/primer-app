import type { Tree } from "@/primer-api";

/*
Some example trees.

It's important that node IDs are unique across all the numbered trees,
as we'd like to render them simultaneously on one canvas.
*/

export const tree1: Tree = {
  body: { tag: "NoBody", contents: "EmptyHole" },
  childTrees: [],
  nodeId: "100",
};

export const tree2: Tree = {
  body: { tag: "TextBody", contents: { fst: "Lam", snd: { baseName: "x" } } },
  childTrees: [
    {
      body: {
        tag: "TextBody",
        contents: { fst: "LocalVar", snd: { baseName: "x" } },
      },
      childTrees: [],
      nodeId: "201",
    },
  ],
  nodeId: "200",
};

export const tree3: Tree = {
  body: {
    tag: "TextBody",
    contents: { fst: "Lam", snd: { baseName: "y" } },
  },
  childTrees: [
    {
      body: {
        tag: "TextBody",
        contents: { fst: "LocalVar", snd: { baseName: "y" } },
      },
      childTrees: [],
      nodeId: "301",
    },
  ],
  nodeId: "300",
};

export const tree4: Tree = {
  body: { tag: "NoBody", contents: "App" },
  childTrees: [
    {
      body: { tag: "NoBody", contents: "Ann" },
      childTrees: [
        {
          body: {
            tag: "TextBody",
            contents: { fst: "LAM", snd: { baseName: "a" } },
          },
          childTrees: [
            {
              body: {
                tag: "TextBody",
                contents: { fst: "Lam", snd: { baseName: "x" } },
              },
              childTrees: [
                {
                  body: {
                    tag: "TextBody",
                    contents: { fst: "LocalVar", snd: { baseName: "x" } },
                  },
                  childTrees: [],
                  nodeId: "404",
                },
              ],
              nodeId: "403",
            },
          ],
          nodeId: "402",
        },
        {
          body: {
            tag: "TextBody",
            contents: { fst: "TForall", snd: { baseName: "a" } },
          },
          childTrees: [
            {
              body: { tag: "NoBody", contents: "TFun" },
              childTrees: [
                {
                  body: {
                    tag: "TextBody",
                    contents: { fst: "TVar", snd: { baseName: "a" } },
                  },
                  childTrees: [],
                  nodeId: "407",
                },
                {
                  body: {
                    tag: "TextBody",
                    contents: { fst: "TVar", snd: { baseName: "a" } },
                  },
                  childTrees: [],
                  nodeId: "408",
                },
              ],
              nodeId: "406",
            },
          ],
          nodeId: "405",
        },
      ],
      nodeId: "401",
    },
    {
      body: {
        tag: "TextBody",
        contents: { fst: "Con", snd: { baseName: "Unit" } },
      },
      childTrees: [],
      nodeId: "409",
    },
  ],
  nodeId: "400",
};

export const tree5: Tree = {
  body: {
    tag: "TextBody",
    contents: { fst: "Lam", snd: { baseName: "x" } },
  },
  childTrees: [
    {
      body: { tag: "NoBody", contents: "Case" },
      childTrees: [
        {
          body: {
            tag: "TextBody",
            contents: { fst: "LocalVar", snd: { baseName: "x" } },
          },
          childTrees: [],
          nodeId: "502",
        },
        {
          body: { tag: "NoBody", contents: "EmptyHole" },
          childTrees: [],
          nodeId: "503",
        },
        {
          body: { tag: "NoBody", contents: "EmptyHole" },
          childTrees: [],
          nodeId: "506",
        },
      ],
      nodeId: "501",
    },
  ],
  nodeId: "500",
};

export const oddEvenTrees: [string, Tree][] = [
  [
    "even",
    {
      body: {
        contents: { fst: "Lam", snd: { baseName: "x" } },
        tag: "TextBody",
      },
      childTrees: [
        {
          body: { tag: "NoBody", contents: "Case" },
          childTrees: [
            {
              body: {
                contents: { fst: "LocalVar", snd: { baseName: "x" } },
                tag: "TextBody",
              },
              childTrees: [],
              nodeId: "5",
            },
            {
              body: { tag: "NoBody", contents: "CaseWith" },
              childTrees: [
                {
                  body: {
                    contents: {
                      fst: "Pattern",
                      snd: {
                        body: {
                          contents: {
                            fst: "PatternCon",
                            snd: {
                              baseName: "Zero",
                              qualifiedModule: ["Builtins"],
                            },
                          },
                          tag: "TextBody",
                        },
                        childTrees: [],
                        nodeId: "4P0B",
                      },
                    },
                    tag: "BoxBody",
                  },
                  childTrees: [
                    {
                      body: {
                        contents: {
                          fst: "Con",
                          snd: {
                            baseName: "True",
                            qualifiedModule: ["Builtins"],
                          },
                        },
                        tag: "TextBody",
                      },
                      childTrees: [],
                      nodeId: "6",
                    },
                  ],
                  nodeId: "4P0",
                },
                {
                  body: {
                    contents: {
                      fst: "Pattern",
                      snd: {
                        body: { tag: "NoBody", contents: "App" },
                        childTrees: [
                          {
                            body: {
                              contents: {
                                fst: "PatternCon",
                                snd: {
                                  baseName: "Succ",
                                  qualifiedModule: ["Builtins"],
                                },
                              },
                              tag: "TextBody",
                            },
                            childTrees: [],
                            nodeId: "4P1B",
                          },
                          {
                            body: {
                              contents: {
                                fst: "PatternBind",
                                snd: { baseName: "n" },
                              },
                              tag: "TextBody",
                            },
                            childTrees: [],
                            nodeId: "7",
                          },
                        ],
                        nodeId: "7A",
                      },
                    },
                    tag: "BoxBody",
                  },
                  childTrees: [
                    {
                      body: { tag: "NoBody", contents: "App" },
                      childTrees: [
                        {
                          body: {
                            contents: {
                              fst: "GlobalVar",
                              snd: {
                                baseName: "odd",
                                qualifiedModule: ["Even3"],
                              },
                            },
                            tag: "TextBody",
                          },
                          childTrees: [],
                          nodeId: "9",
                        },
                        {
                          body: {
                            contents: {
                              fst: "LocalVar",
                              snd: { baseName: "n" },
                            },
                            tag: "TextBody",
                          },
                          childTrees: [],
                          nodeId: "10",
                        },
                      ],
                      nodeId: "8",
                    },
                  ],
                  nodeId: "4P1",
                },
              ],
              nodeId: "4W",
            },
          ],
          nodeId: "4",
        },
      ],
      nodeId: "3",
    },
  ],
  [
    "even 3?",
    {
      body: { tag: "NoBody", contents: "App" },
      childTrees: [
        {
          body: {
            contents: {
              fst: "GlobalVar",
              snd: { baseName: "even", qualifiedModule: ["Even3"] },
            },
            tag: "TextBody",
          },
          childTrees: [],
          nodeId: "24",
        },
        {
          body: { tag: "NoBody", contents: "App" },
          childTrees: [
            {
              body: {
                contents: {
                  fst: "Con",
                  snd: { baseName: "Succ", qualifiedModule: ["Builtins"] },
                },
                tag: "TextBody",
              },
              childTrees: [],
              nodeId: "26",
            },
            {
              body: { tag: "NoBody", contents: "App" },
              childTrees: [
                {
                  body: {
                    contents: {
                      fst: "Con",
                      snd: {
                        baseName: "Succ",
                        qualifiedModule: ["Builtins"],
                      },
                    },
                    tag: "TextBody",
                  },
                  childTrees: [],
                  nodeId: "28",
                },
                {
                  body: { tag: "NoBody", contents: "App" },
                  childTrees: [
                    {
                      body: {
                        contents: {
                          fst: "Con",
                          snd: {
                            baseName: "Succ",
                            qualifiedModule: ["Builtins"],
                          },
                        },
                        tag: "TextBody",
                      },
                      childTrees: [],
                      nodeId: "30",
                    },
                    {
                      body: {
                        contents: {
                          fst: "Con",
                          snd: {
                            baseName: "Zero",
                            qualifiedModule: ["Builtins"],
                          },
                        },
                        tag: "TextBody",
                      },
                      childTrees: [],
                      nodeId: "31",
                    },
                  ],
                  nodeId: "29",
                },
              ],
              nodeId: "27",
            },
          ],
          nodeId: "25",
        },
      ],
      nodeId: "23",
    },
  ],
  [
    "odd",
    {
      body: {
        contents: { fst: "Lam", snd: { baseName: "x" } },
        tag: "TextBody",
      },
      childTrees: [
        {
          body: { tag: "NoBody", contents: "Case" },
          childTrees: [
            {
              body: {
                contents: { fst: "LocalVar", snd: { baseName: "x" } },
                tag: "TextBody",
              },
              childTrees: [],
              nodeId: "16",
            },
            {
              body: { tag: "NoBody", contents: "CaseWith" },
              childTrees: [
                {
                  body: {
                    contents: {
                      fst: "Pattern",
                      snd: {
                        body: {
                          contents: {
                            fst: "PatternCon",
                            snd: {
                              baseName: "Zero",
                              qualifiedModule: ["Builtins"],
                            },
                          },
                          tag: "TextBody",
                        },
                        childTrees: [],
                        nodeId: "15P0B",
                      },
                    },
                    tag: "BoxBody",
                  },
                  childTrees: [
                    {
                      body: {
                        contents: {
                          fst: "Con",
                          snd: {
                            baseName: "False",
                            qualifiedModule: ["Builtins"],
                          },
                        },
                        tag: "TextBody",
                      },
                      childTrees: [],
                      nodeId: "17",
                    },
                  ],
                  nodeId: "15P0",
                },
                {
                  body: {
                    contents: {
                      fst: "Pattern",
                      snd: {
                        body: {
                          tag: "NoBody",
                          contents: "PatternApp",
                        },
                        childTrees: [
                          {
                            body: {
                              contents: {
                                fst: "PatternCon",
                                snd: {
                                  baseName: "Succ",
                                  qualifiedModule: ["Builtins"],
                                },
                              },
                              tag: "TextBody",
                            },
                            childTrees: [],
                            nodeId: "15P1B",
                          },
                          {
                            body: {
                              contents: {
                                fst: "PatternBind",
                                snd: { baseName: "n" },
                              },
                              tag: "TextBody",
                            },
                            childTrees: [],
                            nodeId: "18",
                          },
                        ],
                        nodeId: "18A",
                      },
                    },
                    tag: "BoxBody",
                  },
                  childTrees: [
                    {
                      body: { tag: "NoBody", contents: "App" },
                      childTrees: [
                        {
                          body: {
                            contents: {
                              fst: "GlobalVar",
                              snd: {
                                baseName: "even",
                                qualifiedModule: ["Even3"],
                              },
                            },
                            tag: "TextBody",
                          },
                          childTrees: [],
                          nodeId: "20",
                        },
                        {
                          body: {
                            contents: {
                              fst: "LocalVar",
                              snd: { baseName: "n" },
                            },
                            tag: "TextBody",
                          },
                          childTrees: [],
                          nodeId: "21",
                        },
                      ],
                      nodeId: "19",
                    },
                  ],
                  nodeId: "15P1",
                },
              ],
              nodeId: "15W",
            },
          ],
          nodeId: "15",
        },
      ],
      nodeId: "14",
    },
  ],
];

export const oddEvenTreesMiscStyles: [string, Tree][] = [
  [
    "even",
    {
      body: {
        contents: { fst: "Lam", snd: { baseName: "x" } },
        tag: "TextBody",
      },
      childTrees: [
        {
          body: { tag: "NoBody", contents: "Case" },
          childTrees: [
            {
              body: {
                contents: { fst: "LocalVar", snd: { baseName: "x" } },
                tag: "TextBody",
              },
              childTrees: [],
              nodeId: "5",
            },
          ],
          nodeId: "4",
          rightChild: {
            body: {
              contents: {
                fst: "Pattern",
                snd: {
                  body: {
                    contents: {
                      fst: "PatternCon",
                      snd: {
                        baseName: "Zero",
                        qualifiedModule: ["Builtins"],
                      },
                    },
                    tag: "TextBody",
                  },
                  childTrees: [],
                  nodeId: "4P0B",
                },
              },
              tag: "BoxBody",
            },
            childTrees: [
              {
                body: {
                  contents: {
                    fst: "Con",
                    snd: { baseName: "True", qualifiedModule: ["Builtins"] },
                  },
                  tag: "TextBody",
                },
                childTrees: [],
                nodeId: "6",
              },
            ],
            nodeId: "4P0",
            rightChild: {
              body: {
                contents: {
                  fst: "Pattern",
                  snd: {
                    body: { tag: "NoBody", contents: "PatternApp" },
                    childTrees: [
                      {
                        body: {
                          contents: {
                            fst: "PatternCon",
                            snd: {
                              baseName: "Succ",
                              qualifiedModule: ["Builtins"],
                            },
                          },
                          tag: "TextBody",
                        },
                        childTrees: [],
                        nodeId: "4P1B",
                      },
                      {
                        body: {
                          contents: {
                            fst: "PatternBind",
                            snd: { baseName: "n" },
                          },
                          tag: "TextBody",
                        },
                        childTrees: [],
                        nodeId: "7",
                      },
                    ],
                    nodeId: "7A",
                  },
                },
                tag: "BoxBody",
              },
              childTrees: [
                {
                  body: { tag: "NoBody", contents: "App" },
                  childTrees: [
                    {
                      body: {
                        contents: {
                          fst: "GlobalVar",
                          snd: {
                            baseName: "odd",
                            qualifiedModule: ["Even3"],
                          },
                        },
                        tag: "TextBody",
                      },
                      childTrees: [],
                      nodeId: "9",
                    },
                    {
                      body: {
                        contents: { fst: "LocalVar", snd: { baseName: "n" } },
                        tag: "TextBody",
                      },
                      childTrees: [],
                      nodeId: "10",
                    },
                  ],
                  nodeId: "8",
                },
              ],
              nodeId: "4P1",
            },
          },
        },
      ],
      nodeId: "3",
    },
  ],
  [
    "even 3?",
    {
      body: { tag: "NoBody", contents: "App" },
      childTrees: [
        {
          body: {
            contents: {
              fst: "GlobalVar",
              snd: { baseName: "even", qualifiedModule: ["Even3"] },
            },
            tag: "TextBody",
          },
          childTrees: [],
          nodeId: "24",
        },
        {
          body: { tag: "NoBody", contents: "App" },
          childTrees: [
            {
              body: {
                contents: {
                  fst: "Con",
                  snd: { baseName: "Succ", qualifiedModule: ["Builtins"] },
                },
                tag: "TextBody",
              },
              childTrees: [],
              nodeId: "26",
            },
            {
              body: { tag: "NoBody", contents: "App" },
              childTrees: [
                {
                  body: {
                    contents: {
                      fst: "Con",
                      snd: {
                        baseName: "Succ",
                        qualifiedModule: ["Builtins"],
                      },
                    },
                    tag: "TextBody",
                  },
                  childTrees: [],
                  nodeId: "28",
                },
                {
                  body: { tag: "NoBody", contents: "App" },
                  childTrees: [
                    {
                      body: {
                        contents: {
                          fst: "Con",
                          snd: {
                            baseName: "Succ",
                            qualifiedModule: ["Builtins"],
                          },
                        },
                        tag: "TextBody",
                      },
                      childTrees: [],
                      nodeId: "30",
                    },
                    {
                      body: {
                        contents: {
                          fst: "Con",
                          snd: {
                            baseName: "Zero",
                            qualifiedModule: ["Builtins"],
                          },
                        },
                        tag: "TextBody",
                      },
                      childTrees: [],
                      nodeId: "31",
                    },
                  ],
                  nodeId: "29",
                },
              ],
              nodeId: "27",
            },
          ],
          nodeId: "25",
        },
      ],
      nodeId: "23",
    },
  ],
  [
    "odd",
    {
      body: {
        contents: { fst: "Lam", snd: { baseName: "x" } },
        tag: "TextBody",
      },
      childTrees: [
        {
          body: { tag: "NoBody", contents: "Case" },
          childTrees: [
            {
              body: {
                contents: { fst: "LocalVar", snd: { baseName: "x" } },
                tag: "TextBody",
              },
              childTrees: [],
              nodeId: "16",
            },
          ],
          nodeId: "15",
          rightChild: {
            body: {
              contents: {
                fst: "Pattern",
                snd: {
                  body: {
                    contents: {
                      fst: "PatternCon",
                      snd: { baseName: "Zero", qualifiedModule: ["Builtins"] },
                    },
                    tag: "TextBody",
                  },
                  childTrees: [],
                  nodeId: "15P0B",
                },
              },
              tag: "BoxBody",
            },
            childTrees: [
              {
                body: {
                  contents: {
                    fst: "Con",
                    snd: {
                      baseName: "False",
                      qualifiedModule: ["Builtins"],
                    },
                  },
                  tag: "TextBody",
                },
                childTrees: [],
                nodeId: "17",
              },
            ],
            nodeId: "15P0",
            rightChild: {
              body: {
                contents: {
                  fst: "Pattern",
                  snd: {
                    body: {
                      contents: {
                        fst: "Con",
                        snd: {
                          baseName: "Succ",
                          qualifiedModule: ["Builtins"],
                        },
                      },
                      tag: "TextBody",
                    },
                    childTrees: [
                      {
                        body: {
                          contents: {
                            fst: "PatternBind",
                            snd: { baseName: "n" },
                          },
                          tag: "TextBody",
                        },
                        childTrees: [],
                        nodeId: "18",
                      },
                    ],
                    nodeId: "15P1B",
                  },
                },
                tag: "BoxBody",
              },
              childTrees: [
                {
                  body: { tag: "NoBody", contents: "App" },
                  childTrees: [
                    {
                      body: {
                        contents: {
                          fst: "GlobalVar",
                          snd: {
                            baseName: "even",
                            qualifiedModule: ["Even3"],
                          },
                        },
                        tag: "TextBody",
                      },
                      childTrees: [],
                      nodeId: "20",
                    },
                    {
                      body: {
                        contents: { fst: "LocalVar", snd: { baseName: "n" } },
                        tag: "TextBody",
                      },
                      childTrees: [],
                      nodeId: "21",
                    },
                  ],
                  nodeId: "19",
                },
              ],
              nodeId: "15P1",
            },
          },
        },
      ],
      nodeId: "14",
    },
  ],
];
