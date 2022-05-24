import { TreeInteractiveRender } from "@hackworthltd/primer-types";
import ReactFlow, {
  Node,
  Edge,
  MiniMap,
  Controls,
  Handle,
  Position,
  NodeProps,
} from "react-flow-renderer/nocss";
import "react-flow-renderer/dist/style.css";
import useLayout from "./useLayout";

export type TreeReactFlowProps = {
  tree: TreeInteractiveRender;
  width: number;
  height: number;
  nodeWidth: number;
  nodeHeight: number;
};

const primerNodeTypeName = "primer";
type PrimerNodeProps = { label: string; width: number; height: number };
const PrimerNode = (p: NodeProps<PrimerNodeProps>) => {
  const handleStyle = "absolute border-[2px] border-solid border-grey-tertiary";
  return (
    <>
      <Handle type="target" position={Position.Top} className={handleStyle} />
      <div
        className="flex items-center justify-center rounded text-grey-tertiary border-[3px]"
        style={{ width: p.data.width, height: p.data.height }}
      >
        {p.data.label}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className={handleStyle}
      />
    </>
  );
};

const convertTree = (
  tree: TreeInteractiveRender,
  nodeWidth: number,
  nodeHeight: number
): {
  nodes: Node[];
  edges: Edge[];
} => {
  const children = tree.childTrees.map((t) =>
    convertTree(t, nodeWidth, nodeHeight)
  );
  const id = tree.nodeId.toString();
  const thisNode: Node<PrimerNodeProps> = {
    id,
    type: primerNodeTypeName,
    data: { label: tree.label, width: nodeWidth, height: nodeHeight },
    position: { x: 0, y: 0 }, // this gets overwritten by layout algorithm
  };
  const thisToChildren: Edge[] = tree.childTrees.map((t) => {
    const target = t.nodeId.toString();
    return {
      id: JSON.stringify([id, target]),
      source: id,
      target,
      type: "step",
      className: "stroke-grey-tertiary stroke-[4px]",
    };
  });
  return {
    nodes: [thisNode, ...children.flatMap(({ nodes }) => nodes)],
    edges: [...thisToChildren, ...children.flatMap(({ edges }) => edges)],
  };
};

export const TreeReactFlow = (p: TreeReactFlowProps) => {
  const tree = convertTree(p.tree, p.nodeWidth, p.nodeHeight);
  const layoutedNodes = useLayout(tree.nodes, tree.edges, {
    direction: "TB",
    nodeWidth: p.nodeWidth,
    nodeHeight: p.nodeHeight,
  });

  return (
    <div style={{ height: p.height, width: p.width }}>
      <ReactFlow
        nodes={layoutedNodes}
        edges={tree.edges}
        onNodeClick={(e, _n) => p.tree.onClick?.(e)}
        nodeTypes={{ [primerNodeTypeName]: PrimerNode }}
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};
