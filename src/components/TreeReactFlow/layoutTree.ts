import { Edge } from "react-flow-renderer/nocss";
import { InnerNode, Node, TidyLayout } from "@zxch3n/tidy";
import { WasmLayoutType } from "@zxch3n/tidy/wasm_dist";
import {
  Empty,
  NodeNoPos,
  PrimerDefNameNodeProps,
  PrimerNodeProps,
  PrimerTree,
  PrimerTreeNoPos,
  treeMap,
  treeNodes,
} from "./Types";

export const layoutTree = (
  primerTree: PrimerTreeNoPos
): Promise<{
  tree: PrimerTree;
  width: number;
  height: number;
}> =>
  TidyLayout.create().then((layout) => {
    layout.changeLayoutType(WasmLayoutType.Tidy);
    const [treeTidy0, nodeMap] = primerToTidy(primerTree);
    const treeTidy = layout.set_root(treeTidy0);
    layout.layout(true);
    layout.dispose();
    const treeUnNormalized = tidyToPrimer(
      treeTidy,
      (id) =>
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion*/
        nodeMap.get(id)![0],
      (source, target) =>
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion*/
        nodeMap.get(source)![1].get(target)!
    );
    const nodes = treeNodes(treeUnNormalized);
    const minX = Math.min(...nodes.map((n) => n.position.x));
    const minY = Math.min(...nodes.map((n) => n.position.y));
    const tree = treeMap(treeUnNormalized, (n) => ({
      ...n,
      // Ensure top-left is at (0,0). This makes the result easier to work with.
      position: { x: n.position.x - minX, y: n.position.y - minY },
    }));
    const width = nodes
      ? Math.max(...nodes.map((n) => n.position.x + n.data.width)) - minX
      : 0;
    const height = nodes
      ? Math.max(...nodes.map((n) => n.position.y + n.data.height)) - minY
      : 0;
    return { tree, minX, minY, width, height };
  });

type NodeInfo = {
  id: number;
  node: NodeNoPos<PrimerNodeProps | PrimerDefNameNodeProps>;
  edges: { target: string; edge: Edge<Empty> }[];
};
type NodeMap = Map<
  number,
  [NodeNoPos<PrimerNodeProps | PrimerDefNameNodeProps>, EdgeMap]
>;
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

// Tidy uses numeric IDs, so we label our nodes with ascending integers.
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

// Convert numeric IDs back to the original annotated nodes and edges.
export const tidyToPrimer = (
  tree: InnerNode,
  lookupNode: (
    id: number
  ) => NodeNoPos<PrimerNodeProps | PrimerDefNameNodeProps>,
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
