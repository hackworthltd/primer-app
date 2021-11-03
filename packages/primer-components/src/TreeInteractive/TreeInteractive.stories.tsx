import { Component } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { TreeInteractiveRender } from "@hackworthltd/primer-types";
import TreeOutline from "@/TreeOutline";

interface State {
  nxtId: number;
  tree: TreeInteractiveRender;
}

interface Args {
  labels: string[];
}

// This component just wraps a tree with some state and adds callbacks
// so one can see what happens when nodes get inserted/deleted
class ITree extends Component<Args, State> {
  constructor(props: Args) {
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
    return <TreeOutline {...this.state.tree} />;
  }
}

const Template: ComponentStory<(args: Args) => JSX.Element> = (args) => (
  <ITree labels={args.labels} />
);

export default {
  title: "Application/Component Library/Tree-Interactive",
  component: ITree,
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
