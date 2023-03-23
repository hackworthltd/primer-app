import {
  InnerNode as InnerTidyNode,
  Node as TidyNode,
  TidyLayout,
} from "@zxch3n/tidy";
import { WasmLayoutType } from "@zxch3n/tidy/wasm_dist";
import { unzip } from "fp-ts/lib/Array";
import { fst, mapFst, mapSnd } from "fp-ts/lib/Tuple";
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
  TidyLayout.create(WasmLayoutType.Tidy).then((layout) => {
    const [treeTidy0, nodeInfos, edgeInfos] = primerToTidy(primerTree);
    const treeTidy = layout.set_root(treeTidy0);
    layout.layout(true);
    layout.dispose();
    const nodeMap = makeNodeMap(nodeInfos, edgeInfos, tidyTreeNodes(treeTidy));
    const treeUnNormalized = makePrimerTree(
      primerTree.node.id,
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

type NodeInfo<N> = {
  node: N;
  tidyId: number;
};
type EdgeInfo<E> = {
  edge: E;
  isRight: boolean;
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
  nodeInfos: NodeInfo<N>[],
  edgeInfos: EdgeInfo<E>[],
  positions: { id: number; x: number; y: number }[]
): Map<string, TreeNode<N, E>> => {
  const posMap = new Map<number, { x: number; y: number }>();
  positions.forEach((n) => posMap.set(n.id, n));
  const tidyIdToPrimer = new Map<number, string>();
  const nodeMap = new Map<string, TreeNode<N, E>>();
  nodeInfos.forEach((n) => {
    tidyIdToPrimer.set(n.tidyId, n.node.id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { x, y } = posMap.get(n.tidyId)!;
    nodeMap.set(n.node.id, {
      node: { ...n.node, position: { x: x - n.node.data.width / 2, y } },
      // Edges (including right edge) will be filled in later when we iterate over `n.edges`.
      edges: [],
    });
  });
  edgeInfos.forEach(({ edge, isRight }) => {
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
  return nodeMap;
};

// Convert a Primer tree to a Tidy one. The topology may differ slightly,
// since we use dummy edges e.g. in order to obtain a more desirable placement of right-children.
// Tidy uses numeric IDs, so we must label nodes with ascending integers.
// As well as the Tidy tree itself, we also output extra info needed to reconstruct the Primer tree from it.
const primerToTidy = <N extends { data: { width: number; height: number } }, E>(
  t0: Tree<N, E>
): [TidyNode, NodeInfo<N>[], EdgeInfo<E>[]] => {
  const nodeInfos: NodeInfo<N>[] = [];
  const edgeInfos: EdgeInfo<E>[] = [];
  let tidyId = 1; // 0 is reserved for possible dummy root - see below
  const tagRight = (isRight: boolean) => (edge: E) => ({ edge, isRight });
  const go = (t: Tree<N, E>): TidyNode => {
    const children = t.childTrees.flatMap((child) =>
      [mapSnd(tagRight(false))(child)]
        // We explore all transitive right-children now,
        // telling Tidy that they are children of the current node,
        // so that it will lay them out at the same y-coordinates as their real parents.
        // We still keep track of the original topology in the `source` and `target` of `Edge`s.
        .concat(transitiveRightChildren(child[0]).map(mapSnd(tagRight(true))))
        .map(mapFst(go))
    );
    tidyId = tidyId + 1;
    nodeInfos.push({
      tidyId,
      node: t.node,
    });
    children.forEach(([_, e]) => edgeInfos.push(e));
    return {
      width: t.node.data.width,
      height: t.node.data.height,
      children: children.map(fst),
      id: tidyId,
      // Initial coordinates are unused and immediately overwritten.
      x: 0,
      y: 0,
    };
  };

  // Usually we look ahead for right-children, exploring them from their grandparent (see above).
  // Therefore, when the root node has right-children, they would be ignored without special handling.
  // Here we check for such children, and associate them with a dummy root node for layout purposes.
  // Note that this dummy node has no associated Primer node, so it's existence is entirely confined to
  // this module. In particular, it will never result in the creation of any DOM element, even an invisible one.
  if (t0.rightChild) {
    const rights = transitiveRightChildren(t0);
    const [trees, edges] = unzip(rights);
    edges.forEach((edge) => edgeInfos.push(tagRight(true)(edge)));
    return [
      {
        children: [go(t0)].concat(trees.map(go)),
        // We use the ID 0 here, to avoid any clashing with our normal nodes, which all have positive IDs.
        // Negative nodes seem to be used internally by Tidy.
        // Or at least, using `id: -1` here causes weird layout distortions.
        id: 0,
        // These remaining values make no difference for this dummy node.
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      },
      nodeInfos,
      edgeInfos,
    ];
  } else {
    return [go(t0), nodeInfos, edgeInfos];
  }
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

const transitiveRightChildren = <N, E>(t: Tree<N, E>): [Tree<N, E>, E][] =>
  t.rightChild
    ? [t.rightChild].concat(transitiveRightChildren(t.rightChild[0]))
    : [];

const tidyTreeNodes = (t: InnerTidyNode): InnerTidyNode[] =>
  [t].concat(t.children.flatMap(tidyTreeNodes));
