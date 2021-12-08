import { Component } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { TreeInteractiveRender } from "@hackworthltd/primer-types";
import TreeD3 from "@/TreeD3";
import TreeOutline from "@/TreeOutline";
import TreeVisx, { LinkType } from "@/TreeVisx";

interface State {
  nxtId: number;
  tree: TreeInteractiveRender;
}

type TreeLT = { tree: TreeInteractiveRender; linkType: LinkType };

const TreeOutlineRender = ({ tree }: TreeLT) => TreeOutline(tree);

const TreeVisxDefault = ({ tree, linkType }: TreeLT) =>
  TreeVisx({ width: 300, height: 300, linkType: linkType, tree: tree });

const TreeD3Default = ({ tree, linkType }: TreeLT) =>
  TreeD3({ width: 300, height: 300, linkType: linkType, tree: tree });

type Renderer = "TreeOutline" | "TreeVisx";
const renderersMap = {
  TreeVisx: TreeVisxDefault,
  TreeD3: TreeD3Default,
  TreeOutline: TreeOutlineRender,
};

interface ITreeArgs {
  labels: string[];
  linkType: LinkType;
  render: (tree: TreeLT) => JSX.Element;
}

// This component just wraps a tree with some state and adds callbacks
// so one can see what happens when nodes get inserted/deleted
class ITree extends Component<ITreeArgs, State> {
  constructor(props: ITreeArgs) {
    super(props);
    this.state = this.mkInitialState();
  }

  mkInitialState(): State {
    return {
      nxtId: 1,
      tree: {
        nodeId: 0,
        label: "root",
        onClick: () => this.addChild([0]),
        onRightClick: (e) => {
          this.remove([0]);
          e.preventDefault();
        },
        childTrees: [],
      },
    };
  }

  addChild(path: number[]): void {
    this.setState((state) => ({
      nxtId: state.nxtId + 1,
      tree: this.addChildHelp(0, path, state.tree),
    }));
  }

  addChildHelp(
    idx: number,
    path: number[],
    tree: TreeInteractiveRender
  ): TreeInteractiveRender {
    if (path.length <= idx || path[idx] !== tree.nodeId) {
      return tree;
    }
    if (path.length === idx + 1 && path[idx] === tree.nodeId) {
      const n1 =
        this.props.labels[Math.floor(Math.random() * this.props.labels.length)];
      const n = n1 === undefined ? "DEFAULT-LABEL" : n1;
      const newId = this.state.nxtId;
      const newNode: TreeInteractiveRender = {
        nodeId: newId,
        label: n,
        childTrees: [],
        onClick: () => this.addChild(path.concat([newId])),
        onRightClick: (e) => {
          this.remove(path.concat([newId]));
          e.preventDefault();
        },
      };
      return {
        ...tree,
        childTrees: tree.childTrees.concat([newNode]),
      };
    }
    return {
      ...tree,
      childTrees: tree.childTrees.map((t) =>
        this.addChildHelp(idx + 1, path, t)
      ),
    };
  }

  remove(path: number[]): void {
    if (path.length <= 1) {
      // removing the root: reset
      this.setState(this.mkInitialState());
    } else {
      this.setState((state) => ({
        tree: this.removeHelp(1, path, state.tree),
      }));
    }
  }

  removeHelp(
    idx: number,
    path: number[],
    tree: TreeInteractiveRender
  ): TreeInteractiveRender {
    if (
      path.length <= idx ||
      (idx > 0 && path.length >= idx && path[idx - 1] != tree.nodeId)
    ) {
      return tree;
    }
    if (path.length === idx + 1) {
      return {
        ...tree,
        childTrees: tree.childTrees.filter((t) => t.nodeId !== path[idx]),
      };
    }
    return {
      ...tree,
      childTrees: tree.childTrees.map((t) => this.removeHelp(idx + 1, path, t)),
    };
  }

  override render(): JSX.Element {
    const Render = this.props.render;
    return <Render tree={this.state.tree} linkType={this.props.linkType} />;
  }
}

const TreeCheck = ({
  renderers,
  treeLT,
}: {
  renderers: Renderer[];
  treeLT: TreeLT;
}): JSX.Element => {
  return (
    <div className="flex">
      {renderers.map((i) => {
        const R = renderersMap[i];
        return <R key={i} {...treeLT} />;
      })}
    </div>
  );
};

interface StoryArgs {
  labels: string[];
  linkType: LinkType;
  renderers: Renderer[];
}

const Template: ComponentStory<(args: StoryArgs) => JSX.Element> = (args) => (
  <ITree
    {...args}
    render={(t) => TreeCheck({ renderers: args.renderers, treeLT: t })}
  />
);

export default {
  title: "Application/Component Library/Tree-Interactive",
  component: Template,
  args: {
    renderers: Object.keys(renderersMap),
    linkType: "line",
  },
  argTypes: {
    render: { table: { disable: true } },
    renderers: {
      options: Object.keys(renderersMap),
      control: { type: "inline-check" },
    },
    linkType: {
      control: { type: "radio" },
      options: ["line", "step", "curve", "diagonal"],
      name: "Edge style for Visx trees",
    },
  },
  decorators: [
    (Story) => (
      <div>
        <div>controls: click to add a child; right-click to remove a node.</div>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof ITree>;

export const Default = Template.bind({});
Default.args = { labels: ["node", "foobar", "x"] };
