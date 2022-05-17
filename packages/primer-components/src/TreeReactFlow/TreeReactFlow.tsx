import { TreeInteractiveRender } from "@hackworthltd/primer-types";
import ReactFlow, { Node, Edge, MiniMap, Controls } from "react-flow-renderer";
import useLayout from "./useLayout";

export type TreeReactFlowProps = {
  tree: TreeInteractiveRender;
  width: number;
  height: number;
};

const convertTree = (
  tree: TreeInteractiveRender
): {
  nodes: Node[];
  edges: Edge[];
} => {
  const children = tree.childTrees.map(convertTree);
  const id = tree.nodeId.toString();
  const thisNode: Node = {
    id,
    data: { label: tree.label },
    position: { x: 0, y: 0 }, // this gets overwritten by layout algorithm
  };
  const thisToChildren: Edge[] = tree.childTrees.map((t) => {
    const target = t.nodeId.toString();
    return {
      id: JSON.stringify([id, target]),
      source: id,
      target,
    };
  });
  return {
    nodes: [thisNode, ...children.flatMap(({ nodes }) => nodes)],
    edges: [...thisToChildren, ...children.flatMap(({ edges }) => edges)],
  };
};

export const TreeReactFlow = (args: TreeReactFlowProps) => {
  const tree = convertTree(args.tree);
  const layoutedNodes = useLayout(tree.nodes, tree.edges, { direction: "TB" });

  return (
    <div style={{ height: args.height, width: args.width }}>
      <ReactFlow
        nodes={layoutedNodes}
        edges={tree.edges}
        onNodeClick={(e, _n) => args.tree.onClick?.(e)}
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};
