import { Edge } from "react-flow-renderer/nocss";
import { InnerNode, Node, TidyLayout } from "tidy";
import { WasmLayoutType } from "tidy/wasm_dist";
import {
  Empty,
  NodeNoPos,
  PrimerNodeProps,
  PrimerTree,
  PrimerTreeNoPos,
} from "./Types";

export const layoutTree = (primerTree: PrimerTreeNoPos): Promise<PrimerTree> =>
  TidyLayout.create().then((layout) => {
    layout.changeLayoutType(WasmLayoutType.Tidy);
    const [tree0, nodeMap] = primerToTidy(primerTree);
    const tree = layout.set_root(tree0);
    layout.layout(true);
    layout.dispose();
    return tidyToPrimer(
      tree,
      (id) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return nodeMap.get(id)![0];
      },
      (source, target) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return nodeMap.get(source)![1].get(target)!;
      }
    );
  });

type NodeInfo = {
  id: number;
  node: NodeNoPos<PrimerNodeProps>;
  edges: { target: string; edge: Edge<Empty> }[];
};
type NodeMap = Map<number, [NodeNoPos<PrimerNodeProps>, EdgeMap]>;
type EdgeMap = Map<string, Edge<Empty>>;
const makeNodeInfoMap = (nodes: NodeInfo[]): NodeMap => {
  const nodeMap: NodeMap = new Map();
  nodes.forEach((n) => {
    const edgeMap: EdgeMap = new Map();
    n.edges.forEach((e) => {
      edgeMap.set(e.target, e.edge);
    });
    nodeMap.set(n.id, [n.node, edgeMap]);
  });
  return nodeMap;
};

const primerToTidy = (t: PrimerTreeNoPos): [Node, NodeMap] => {
  const go = (
    primerTree: PrimerTreeNoPos,
    id: number
  ): [Node, NodeInfo[], number] => {
    const primerChildren = primerTree.childTrees.concat(
      primerTree.rightChild ? [primerTree.rightChild] : []
    );
    const [children, ids, nextId] = primerChildren.reduce<
      [Node[], NodeInfo[], number]
    >(
      (ts, [t, _]) => {
        const [trees, ids, nextId] = ts;
        const [tree1, ids1, nextId1] = go(t, nextId);
        return [trees.concat(tree1), ids.concat(ids1), nextId1];
      },
      [[], [], id + 1]
    );
    return [
      {
        width: primerTree.node.data.width,
        height: primerTree.node.data.height,
        children,
        id,

        // Initial coordinates are unused and immediately overwritten.
        x: 0,
        y: 0,
      },
      ids.concat({
        id,
        node: primerTree.node,
        edges: primerChildren.map(([_, edge]) => ({
          target: edge.target,
          edge,
        })),
      }),
      nextId,
    ];
  };
  const [n, m] = go(t, 0);
  return [n, makeNodeInfoMap(m)];
};

export const tidyToPrimer = (
  tree: InnerNode,
  lookupNode: (id: number) => NodeNoPos<PrimerNodeProps>,
  lookupEdge: (source: number, target: string) => Edge<Empty>
): PrimerTree => {
  const trees = tree.children.reduce<PrimerTree[]>((ts, t) => {
    return ts.concat(tidyToPrimer(t, lookupNode, lookupEdge));
  }, []);
  const node = lookupNode(tree.id);
  return {
    childTrees: trees.map((t) => [t, lookupEdge(tree.id, t.node.id)]),
    node: {
      ...node,
      position: {
        x: tree.x - node.data.width / 2,
        y: tree.y,
      },
    },
  };
};
