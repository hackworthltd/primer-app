import { TreeInteractiveRender } from "@hackworthltd/primer-types";
import ReactFlow, { Node, Edge, MiniMap, Controls } from "react-flow-renderer";

export type TreeReactFlowProps = {
  tree: TreeInteractiveRender;
  width: number;
  height: number;
};

const convertTree = (
  tree: TreeInteractiveRender,
  x: number = 0,
  y: number = 0
): {
  nodes: Node[];
  edges: Edge[];
} => {
  const children = tree.childTrees.map((t, n) =>
    convertTree(t, x + n * 200, y + 60)
  );
  const id = tree.nodeId.toString();
  const thisNode: Node = {
    id,
    data: { label: tree.label },
    position: { x, y },
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
  return (
    <div style={{ height: args.height, width: args.width }}>
      <ReactFlow
        nodes={tree.nodes}
        edges={tree.edges}
        onNodeClick={(e, _n) => args.tree.onClick?.(e)}
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};
