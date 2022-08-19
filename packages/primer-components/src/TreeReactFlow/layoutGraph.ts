import { Node, Edge, Position } from "react-flow-renderer/nocss";
import { graphlib, layout } from "dagre";

export type NodeNoPos<T> = Omit<Node<T>, "position">;

export function layoutGraph<
  N extends {
    width: number;
    height: number;
  },
  E
>(
  nodes: NodeNoPos<N>[],
  edges: Edge<E>[]
): { nodes: Node<N>[]; width: number; height: number } {
  const dagreGraph = new graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB" });

  nodes.forEach((el) => {
    dagreGraph.setNode(el.id, { width: el.data.width, height: el.data.height });
  });
  edges.forEach((el) => {
    dagreGraph.setEdge(el.source, el.target);
  });

  layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
        position: {
          x: nodeWithPosition.x - node.data.width / 2,
          y: nodeWithPosition.y - node.data.height / 2,
        },
      };
    }),
    width: dagreGraph.graph().width!,
    height: dagreGraph.graph().height!,
  };
}
