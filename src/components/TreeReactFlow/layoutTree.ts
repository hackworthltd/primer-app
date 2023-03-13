import {
  InnerNode as InnerTidyNode,
  Node as TidyNode,
  TidyLayout,
} from "@zxch3n/tidy";
import { WasmLayoutType } from "@zxch3n/tidy/wasm_dist";
import { treeMap, Tree, Positioned } from "./Types";

export const layoutTree = <
  N extends {
    id: string;
    data: { width: number; height: number };
  },
  E extends {
    source: string;
    target: string;
  }
>(
  primerTree: Tree<N, E>
): Promise<{
  tree: Tree<Positioned<N>, E>;
  width: number;
  height: number;
}> =>
  TidyLayout.create().then((layout) => {
    layout.changeLayoutType(WasmLayoutType.Tidy);
    const [treeTidy0, nodeInfoList] = primerToTidy(primerTree);
    const treeTidy = layout.set_root(treeTidy0);
    layout.layout(true);
    layout.dispose();
    const { rootId, nodeMap } = makeNodeMap(
      treeTidy.id,
      nodeInfoList,
      tidyTreeNodes(treeTidy)
    );
    const treeUnNormalized = makePrimerTree(
      rootId,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (id) => nodeMap.get(id)!
    );
    const nodes = Array.from(nodeMap.values()).map((n) => n.node);
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

type NodeInfo<N, E> = {
  id: number;
  node: N;
  edges: { edge: E; isRight: boolean }[];
};
// A single node of a `Tree<N, E>`.
// Note that this type is very similar in structure to `PrimerTree<N, E>`,
// the only difference being that this type does not contain the actual subtrees.
type TreeNode<N, E> = {
  node: Positioned<N>;
  edges: E[];
  rightEdge?: E;
};
const makeNodeMap = <
  N extends {
    id: string;
    data: { width: number; height: number };
  },
  E extends { source: string; target: string }
>(
  rootId: number,
  nodeInfos: NodeInfo<N, E>[],
  positions: { id: number; x: number; y: number }[]
): { rootId: string; nodeMap: Map<string, TreeNode<N, E>> } => {
  const posMap = new Map<number, { x: number; y: number }>();
  positions.forEach((n) => posMap.set(n.id, n));
  const tidyIdToPrimer = new Map<number, string>();
  const nodeMap = new Map<string, TreeNode<N, E>>();
  nodeInfos.forEach((n) => {
    tidyIdToPrimer.set(n.id, n.node.id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { x, y } = posMap.get(n.id)!;
    nodeMap.set(n.node.id, {
      node: { ...n.node, position: { x: x - n.node.data.width / 2, y } },
      // Edges (including right edge) will be filled in later when we iterate over `n.edges`.
      edges: [],
    });
  });
  nodeInfos.forEach((n) => {
    n.edges.forEach(({ edge, isRight }) => {
      // We know this lookup won't fail since we've already added all nodes to the map.
      // Note that we always have that `edge.source == node.node.id`,
      // but not necessarily `edge.source == tidyIdToPrimer.get(n.id)!`,
      // since `edge` could be a dummy e.g. to assist with placement of right-children.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const node = nodeMap.get(edge.source)!;
      if (isRight) {
        nodeMap.set(edge.source, { ...node, rightEdge: edge });
      } else {
        nodeMap.set(edge.source, {
          ...node,
          edges: node.edges.concat(edge),
        });
      }
    });
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { rootId: tidyIdToPrimer.get(rootId)!, nodeMap };
};

// Convert a Primer tree to a Tidy one. The topology may differ slightly,
// since we use dummy edges e.g. in order to obtain a more desirable placement of right-children.
// Tidy uses numeric IDs, so we must label nodes with ascending integers.
// Alongside the tree, we output a map allowing us to trace these new IDs back to the input nodes,
// along with the rest of the original metadata,
const primerToTidy = <N extends { data: { width: number; height: number } }, E>(
  t: Tree<N, E>
): [TidyNode, NodeInfo<N, E>[]] => {
  let id = 0;
  const go = (primerTree: Tree<N, E>): [TidyNode, NodeInfo<N, E>[]] => {
    const mkNodeInfos = (
      primerTree0: Tree<N, E>[]
    ): [TidyNode[], NodeInfo<N, E>[], E[]] => {
      const r = primerTree0.map<[TidyNode[], NodeInfo<N, E>[], E[]]>((t) => {
        const [tree1, nodes1] = go(t);
        // We explore (transitive) right-children now,
        // telling Tidy that they are children of the current node,
        // so that it will lay them out at the same y-coordinates as their real parents.
        // We still keep track of the original topology in the `source` and `target` of `Edge`s.
        const [treesR, nodesR, rightEdgesR] = t.rightChild
          ? mkNodeInfos([t.rightChild[0]])
          : [[], [], []];
        return [
          [tree1].concat(treesR),
          nodes1.concat(nodesR),
          rightEdgesR.concat(t.rightChild?.[1] ?? []),
        ];
      });
      // Flatten each list in the tuple.
      return [
        r.flatMap((x) => x[0]),
        r.flatMap((x) => x[1]),
        r.flatMap((x) => x[2]),
      ];
    };
    const [children, nodes, rightEdges] = mkNodeInfos(
      primerTree.childTrees.map(([t, _]) => t)
    );
    id = id + 1;
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
      nodes.concat({
        id,
        node: primerTree.node,
        edges: primerTree.childTrees
          .map(([_, edge]) => ({ edge, isRight: false }))
          .concat(rightEdges.map((edge) => ({ edge, isRight: true }))),
      }),
    ];
  };
  return go(t);
};

// Unfold a tree, from an initial node and a function which computes each node's children.
const makePrimerTree = <N, E extends { source: string; target: string }>(
  rootId: string,
  lookupNode: (id: string) => TreeNode<N, E>
): Tree<Positioned<N>, E> => {
  const { node, edges, rightEdge } = lookupNode(rootId);
  return {
    childTrees: edges.map((e) => [makePrimerTree(e.target, lookupNode), e]),
    ...(rightEdge
      ? {
          rightChild: [makePrimerTree(rightEdge.target, lookupNode), rightEdge],
        }
      : {}),
    node,
  };
};

const tidyTreeNodes = (t: InnerTidyNode): InnerTidyNode[] =>
  [t].concat(t.children.flatMap(tidyTreeNodes));
