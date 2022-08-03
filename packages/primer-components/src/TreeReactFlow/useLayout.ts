import { useMemo } from "react";
import { Node, Edge, Position } from "react-flow-renderer/nocss";
import { graphlib, layout } from "dagre";

// the layout direction (T = top, R = right, B = bottom, L = left, TB = top to bottom, ...)
export type Direction = "TB" | "LR" | "RL" | "BT";

export type Options = {
  direction: Direction;
};

const positionMap = {
  T: Position.Top,
  L: Position.Left,
  R: Position.Right,
  B: Position.Bottom,
};

function layoutGraph(
  nodes: Node[],
  edges: Edge[],
  { direction = "TB" }: Options
) {
  const dagreGraph = new graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((el) => {
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
      x: nodeWithPosition.x - node.data.width / 2,
      y: nodeWithPosition.y - node.data.height / 2,
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
