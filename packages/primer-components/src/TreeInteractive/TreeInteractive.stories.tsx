import { Component } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { TreeInteractiveRender } from "@hackworthltd/primer-types";
import TreeOutline from "@/TreeOutline";
import TreeVisx from "@/TreeVisx";

interface State {
  nxtId: number;
  tree: TreeInteractiveRender;
}

const TreeVisxDefault = (tree: TreeInteractiveRender) =>
  TreeVisx({ width: 300, height: 300, linkType: "line", tree: tree });

type Renderer = "TreeOutline" | "TreeVisx";
const renderersMap = {
  TreeVisx: TreeVisxDefault,
  TreeOutline,
};

interface ITreeArgs {
  labels: string[];
  render: (tree: TreeInteractiveRender) => JSX.Element;
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
    return <Render {...this.state.tree} />;
  }
}

const TreeCheck = ({
  renderers,
  tree,
}: {
  renderers: Renderer[];
  tree: TreeInteractiveRender;
}): JSX.Element => {
  return (
    <div className="flex">
      {renderers.map((i) => {
        const R = renderersMap[i];
        return <R key={i} {...tree} />;
      })}
    </div>
  );
};

interface StoryArgs {
  labels: string[];
  renderers: Renderer[];
}

const Template: ComponentStory<(args: StoryArgs) => JSX.Element> = (args) => (
  <ITree
    {...args}
    render={(t) => TreeCheck({ renderers: args.renderers, tree: t })}
  />
);

export default {
  title: "Application/Component Library/Tree-Interactive",
  component: Template,
  argTypes: {
    render: { table: { disable: true } },
    renderers: {
      options: Object.keys(renderersMap),
      defaultValue: Object.keys(renderersMap),
      control: { type: "inline-check" },
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
