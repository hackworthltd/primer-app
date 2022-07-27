import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TreeReactFlow, TreeReactFlowProps } from "./TreeReactFlow";
import { tree1, tree2, tree3, tree4, tree5 } from "@/examples/trees";
import { TreeInteractiveRender } from "@hackworthltd/primer-types";

export default {
  title: "Application/Component Library/TreeReactFlow",
  component: TreeReactFlow,
} as ComponentMeta<typeof TreeReactFlow>;

const props = { width: 1000, height: 1500, nodeWidth: 100, nodeHeight: 80 };

export const Tree1: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...props} trees={[tree1]} />;
export const Tree2: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...props} trees={[tree2]} />;
export const Tree3: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...props} trees={[tree3]} />;
export const Tree4: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...props} trees={[tree4]} />;
export const Tree5: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...props} trees={[tree5]} />;
export const AllTrees: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...props} trees={[tree1, tree2, tree3, tree4, tree5]} />;
export const Tree: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => (
  <TreeReactFlow
    {...props}
    trees={[
      {
        ann: "λ",
        body: "label",
        childTrees: [
          {
            fstPair: {
              Right: {
                ann: "?",
                body: "label",
                childTrees: [],
                colour: "red",
                nodeId: 43,
              },
            },
            sndPair: "ChildBottom",
          },
        ],
        colour: "blueviolet",
        nodeId: 42,
      },
    ]}
  />
);

export const TreesDB: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...props} trees={treesDB} />;

const treesDBall: TreeInteractiveRender[] = [
  {
    ann: "λ",
    body: "x",
    childTrees: [
      {
        fstPair: {
          Right: {
            ann: "match",
            childTrees: [
              {
                fstPair: {
                  Right: {
                    ann: "Var",
                    body: "x",
                    childTrees: [],
                    colour: "cyan",
                    nodeId: 5,
                  },
                },
                sndPair: "ChildLeft",
              },
              {
                fstPair: {
                  Left: {
                    ann: "P",
                    childTrees: [
                      {
                        fstPair: {
                          Right: {
                            ann: "V",
                            body: "True",
                            childTrees: [],
                            colour: "turquoise",
                            nodeId: 6,
                          },
                        },
                        sndPair: "ChildBottom",
                      },
                      {
                        fstPair: {
                          Left: {
                            ann: "P",
                            childTrees: [
                              {
                                fstPair: {
                                  Right: {
                                    ann: "$",
                                    childTrees: [
                                      {
                                        fstPair: {
                                          Right: {
                                            ann: "Var",
                                            body: "odd",
                                            childTrees: [],
                                            colour: "cyan",
                                            nodeId: 9,
                                          },
                                        },
                                        sndPair: "ChildLeft",
                                      },
                                      {
                                        fstPair: {
                                          Right: {
                                            ann: "Var",
                                            body: "n",
                                            childTrees: [],
                                            colour: "cyan",
                                            nodeId: 10,
                                          },
                                        },
                                        sndPair: "ChildRight",
                                      },
                                    ],
                                    colour: "blue",
                                    nodeId: 8,
                                  },
                                },
                                sndPair: "ChildBottom",
                              },
                            ],
                            colour: "yellow",
                            inside: {
                              ann: "Con",
                              body: "Succ",
                              childTrees: [],
                              colour: "turquoise",
                              nodeId: 11956,
                            },
                          },
                        },
                        sndPair: "ChildRight",
                      },
                    ],
                    colour: "yellow",
                    inside: {
                      ann: "Con",
                      body: "Zero",
                      childTrees: [],
                      colour: "turquoise",
                      nodeId: 11956,
                    },
                  },
                },
                sndPair: "ChildRight",
              },
            ],
            colour: "yellow",
            nodeId: 4,
          },
        },
        sndPair: "ChildBottom",
      },
    ],
    colour: "navy",
    nodeId: 3,
  },
  {
    ann: "$",
    childTrees: [
      {
        fstPair: {
          Right: {
            ann: "Var",
            body: "even",
            childTrees: [],
            colour: "cyan",
            nodeId: 24,
          },
        },
        sndPair: "ChildLeft",
      },
      {
        fstPair: {
          Right: {
            ann: "$",
            childTrees: [
              {
                fstPair: {
                  Right: {
                    ann: "V",
                    body: "Succ",
                    childTrees: [],
                    colour: "turquoise",
                    nodeId: 26,
                  },
                },
                sndPair: "ChildLeft",
              },
              {
                fstPair: {
                  Right: {
                    ann: "$",
                    childTrees: [
                      {
                        fstPair: {
                          Right: {
                            ann: "V",
                            body: "Succ",
                            childTrees: [],
                            colour: "turquoise",
                            nodeId: 28,
                          },
                        },
                        sndPair: "ChildLeft",
                      },
                      {
                        fstPair: {
                          Right: {
                            ann: "$",
                            childTrees: [
                              {
                                fstPair: {
                                  Right: {
                                    ann: "V",
                                    body: "Succ",
                                    childTrees: [],
                                    colour: "turquoise",
                                    nodeId: 30,
                                  },
                                },
                                sndPair: "ChildLeft",
                              },
                              {
                                fstPair: {
                                  Right: {
                                    ann: "V",
                                    body: "Zero",
                                    childTrees: [],
                                    colour: "turquoise",
                                    nodeId: 31,
                                  },
                                },
                                sndPair: "ChildRight",
                              },
                            ],
                            colour: "blue",
                            nodeId: 29,
                          },
                        },
                        sndPair: "ChildRight",
                      },
                    ],
                    colour: "blue",
                    nodeId: 27,
                  },
                },
                sndPair: "ChildRight",
              },
            ],
            colour: "blue",
            nodeId: 25,
          },
        },
        sndPair: "ChildRight",
      },
    ],
    colour: "blue",
    nodeId: 23,
  },
  {
    ann: "λ",
    body: "x",
    childTrees: [
      {
        fstPair: {
          Right: {
            ann: "match",
            childTrees: [
              {
                fstPair: {
                  Right: {
                    ann: "Var",
                    body: "x",
                    childTrees: [],
                    colour: "cyan",
                    nodeId: 16,
                  },
                },
                sndPair: "ChildLeft",
              },
              {
                fstPair: {
                  Left: {
                    ann: "P",
                    childTrees: [
                      {
                        fstPair: {
                          Right: {
                            ann: "V",
                            body: "False",
                            childTrees: [],
                            colour: "turquoise",
                            nodeId: 17,
                          },
                        },
                        sndPair: "ChildBottom",
                      },
                      {
                        fstPair: {
                          Left: {
                            ann: "P",
                            childTrees: [
                              {
                                fstPair: {
                                  Right: {
                                    ann: "$",
                                    childTrees: [
                                      {
                                        fstPair: {
                                          Right: {
                                            ann: "Var",
                                            body: "even",
                                            childTrees: [],
                                            colour: "cyan",
                                            nodeId: 20,
                                          },
                                        },
                                        sndPair: "ChildLeft",
                                      },
                                      {
                                        fstPair: {
                                          Right: {
                                            ann: "Var",
                                            body: "n",
                                            childTrees: [],
                                            colour: "cyan",
                                            nodeId: 21,
                                          },
                                        },
                                        sndPair: "ChildRight",
                                      },
                                    ],
                                    colour: "blue",
                                    nodeId: 19,
                                  },
                                },
                                sndPair: "ChildBottom",
                              },
                            ],
                            colour: "yellow",
                            inside: {
                              ann: "Con",
                              body: "Succ",
                              childTrees: [],
                              colour: "turquoise",
                              nodeId: 11956,
                            },
                          },
                        },
                        sndPair: "ChildRight",
                      },
                    ],
                    colour: "yellow",
                    inside: {
                      ann: "Con",
                      body: "Zero",
                      childTrees: [],
                      colour: "turquoise",
                      nodeId: 11956,
                    },
                  },
                },
                sndPair: "ChildRight",
              },
            ],
            colour: "yellow",
            nodeId: 15,
          },
        },
        sndPair: "ChildBottom",
      },
    ],
    colour: "navy",
    nodeId: 14,
  },
];

const treesDB = [treesDBall[0] as TreeInteractiveRender];
