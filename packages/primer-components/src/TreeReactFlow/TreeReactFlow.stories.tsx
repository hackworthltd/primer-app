import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TreeReactFlow, TreeReactFlowProps } from "./TreeReactFlow";
import { tree1, tree2, tree3, tree4, tree5 } from "@/examples/trees";

export default {
  title: "Application/Component Library/TreeReactFlow",
  component: TreeReactFlow,
} as ComponentMeta<typeof TreeReactFlow>;

const props = { width: 1200, height: 800, nodeWidth: 150, nodeHeight: 50 };

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
) => (
  <TreeReactFlow
    {...props}
    trees={[
      {
        body: { contents: "x", tag: "TextBody" },
        childTrees: [
          {
            body: { tag: "NoBody" },
            childTrees: [
              {
                body: { contents: "x", tag: "TextBody" },
                childTrees: [],
                label: "Var",
                nodeId: "5",
                style: "StyleVar",
              },
            ],
            label: "match",
            nodeId: "4",
            rightChild: {
              body: {
                contents: {
                  body: { contents: "Builtins.Zero", tag: "TextBody" },
                  childTrees: [],
                  label: "V",
                  nodeId: "4P0B",
                  style: "StyleCon",
                },
                tag: "BoxBody",
              },
              childTrees: [
                {
                  body: { contents: "Builtins.True", tag: "TextBody" },
                  childTrees: [],
                  label: "V",
                  nodeId: "6",
                  style: "StyleCon",
                },
              ],
              label: "P",
              nodeId: "4P0",
              rightChild: {
                body: {
                  contents: {
                    body: { contents: "Builtins.Succ", tag: "TextBody" },
                    childTrees: [
                      {
                        body: { contents: "n", tag: "TextBody" },
                        childTrees: [],
                        label: "Var",
                        nodeId: "7",
                        style: "StyleVar",
                      },
                    ],
                    label: "V",
                    nodeId: "4P1B",
                    style: "StyleCon",
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
                        label: "Var",
                        nodeId: "9",
                        style: "StyleVar",
                      },
                      {
                        body: { contents: "n", tag: "TextBody" },
                        childTrees: [],
                        label: "Var",
                        nodeId: "10",
                        style: "StyleVar",
                      },
                    ],
                    label: "$",
                    nodeId: "8",
                    style: "StyleApp",
                  },
                ],
                label: "P",
                nodeId: "4P1",
                style: "StylePattern",
              },
              style: "StylePattern",
            },
            style: "StyleCase",
          },
        ],
        label: "λ",
        nodeId: "3",
        style: "StyleLam",
      },
      {
        body: { tag: "NoBody" },
        childTrees: [
          {
            body: { contents: "Even3.even", tag: "TextBody" },
            childTrees: [],
            label: "Var",
            nodeId: "24",
            style: "StyleVar",
          },
          {
            body: { tag: "NoBody" },
            childTrees: [
              {
                body: { contents: "Builtins.Succ", tag: "TextBody" },
                childTrees: [],
                label: "V",
                nodeId: "26",
                style: "StyleCon",
              },
              {
                body: { tag: "NoBody" },
                childTrees: [
                  {
                    body: { contents: "Builtins.Succ", tag: "TextBody" },
                    childTrees: [],
                    label: "V",
                    nodeId: "28",
                    style: "StyleCon",
                  },
                  {
                    body: { tag: "NoBody" },
                    childTrees: [
                      {
                        body: { contents: "Builtins.Succ", tag: "TextBody" },
                        childTrees: [],
                        label: "V",
                        nodeId: "30",
                        style: "StyleCon",
                      },
                      {
                        body: { contents: "Builtins.Zero", tag: "TextBody" },
                        childTrees: [],
                        label: "V",
                        nodeId: "31",
                        style: "StyleCon",
                      },
                    ],
                    label: "$",
                    nodeId: "29",
                    style: "StyleApp",
                  },
                ],
                label: "$",
                nodeId: "27",
                style: "StyleApp",
              },
            ],
            label: "$",
            nodeId: "25",
            style: "StyleApp",
          },
        ],
        label: "$",
        nodeId: "23",
        style: "StyleApp",
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
                label: "Var",
                nodeId: "16",
                style: "StyleVar",
              },
            ],
            label: "match",
            nodeId: "15",
            rightChild: {
              body: {
                contents: {
                  body: { contents: "Builtins.Zero", tag: "TextBody" },
                  childTrees: [],
                  label: "V",
                  nodeId: "15P0B",
                  style: "StyleCon",
                },
                tag: "BoxBody",
              },
              childTrees: [
                {
                  body: { contents: "Builtins.False", tag: "TextBody" },
                  childTrees: [],
                  label: "V",
                  nodeId: "17",
                  style: "StyleCon",
                },
              ],
              label: "P",
              nodeId: "15P0",
              rightChild: {
                body: {
                  contents: {
                    body: { contents: "Builtins.Succ", tag: "TextBody" },
                    childTrees: [
                      {
                        body: { contents: "n", tag: "TextBody" },
                        childTrees: [],
                        label: "Var",
                        nodeId: "18",
                        style: "StyleVar",
                      },
                    ],
                    label: "V",
                    nodeId: "15P1B",
                    style: "StyleCon",
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
                        label: "Var",
                        nodeId: "20",
                        style: "StyleVar",
                      },
                      {
                        body: { contents: "n", tag: "TextBody" },
                        childTrees: [],
                        label: "Var",
                        nodeId: "21",
                        style: "StyleVar",
                      },
                    ],
                    label: "$",
                    nodeId: "19",
                    style: "StyleApp",
                  },
                ],
                label: "P",
                nodeId: "15P1",
                style: "StylePattern",
              },
              style: "StylePattern",
            },
            style: "StyleCase",
          },
        ],
        label: "λ",
        nodeId: "14",
        style: "StyleLam",
      },
    ]}
  />
);
