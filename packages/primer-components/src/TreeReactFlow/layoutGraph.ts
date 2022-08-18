import { Node, Edge, Position } from "react-flow-renderer/nocss";
import { graphlib, layout } from "dagre";

export function layoutGraph(nodes: Node[], edges: Edge[]) {
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

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;
    node.position = {
      x: nodeWithPosition.x - node.data.width / 2,
      y: nodeWithPosition.y - node.data.height / 2,
    };

    return node;
  });
}
