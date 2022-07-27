import { CSSProperties, useMemo } from "react";
import { Node, Edge, Position } from "react-flow-renderer/nocss";
import { graphlib, layout } from "dagre";

// the layout direction (T = top, R = right, B = bottom, L = left, TB = top to bottom, ...)
export type Direction = "TB" | "LR" | "RL" | "BT";

export type Options = {
  direction: Direction;
  nodeWidth: number;
  nodeHeight: number;
};

const positionMap = {
  T: Position.Top,
  L: Position.Left,
  R: Position.Right,
  B: Position.Bottom,
};

// TODO copy-pasted
type PrimerNodeProps = {
  ann: string;
  body?: string;
  width: number;
  height: number;
  style: CSSProperties;
};

function layoutGraph(
  nodes: Node<PrimerNodeProps>[],
  edges: Edge[],
  { direction = "TB", nodeWidth, nodeHeight }: Options
) {
  // const dagreGraph = new graphlib.Graph({ compound: true });
  const dagreGraph = new graphlib.Graph({ compound: true, directed: true });
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  // miniminal example a lot more minimal than suggested: https://github.com/dagrejs/dagre/issues/238
  // const g = dagreGraph;
  // g.setNode("a", { label: "A" });
  // g.setNode("b", { label: "B" });

  // g.setNode("top_group", { label: "Top Group" });
  // g.setNode("bottom_group", { label: "Group" });

  // g.setParent("b", "bottom_group");
  // g.setEdge("a", "bottom_group");

  nodes.forEach((el) => {
    if (el.parentNode) {
      dagreGraph.setParent(el.id, el.parentNode);
    }
    dagreGraph.setNode(el.id, { width: el.data.width, height: el.data.height });
  });

  edges.forEach((el) => {
    dagreGraph.setEdge(el.source, el.target);
  });

  layout(dagreGraph);

  const layoutNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = positionMap[direction[0] as never];
    node.sourcePosition = positionMap[direction[1] as never];

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return layoutNodes;
}

function useLayout(nodes: Node[], edges: Edge[], options: Options) {
  return useMemo(
    () => layoutGraph(nodes, edges, options),
    [nodes, edges, options]
  );
}

export default useLayout;
