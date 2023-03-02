import {
  GlobalName,
  NodeFlavorBoxBody,
  NodeFlavorNoBody,
  NodeFlavorPrimBody,
  NodeFlavorTextBody,
  NodeType,
} from "@/primer-api";
import { Edge } from "reactflow";
import { unzip } from "fp-ts/lib/Array";

/** A generic graph. */
export type Graph<
  N extends { id: string },
  E extends { source: string; target: string }
> = {
  nodes: N[];
  edges: E[];
};

export const combineGraphs = <
  N extends { id: string },
  E extends { source: string; target: string }
>(
  gs: Graph<N, E>[]
): Graph<N, E> => {
  const [nodes, edges] = unzip(gs.map(({ nodes, edges }) => [nodes, edges]));
  return { nodes: nodes.flat(), edges: edges.flat() };
};

export type PrimerGraph<T> = Graph<Positioned<PrimerNode<T>>, PrimerEdge>;

export type PrimerGraphNoPos<T> = Graph<PrimerNode<T>, PrimerEdge>;

/** A generic edge-labelled tree. */
export type TreeSimple<N, E> = {
  node: N;
  childTrees: [TreeSimple<N, E>, E][];
  rightChild?: [TreeSimple<N, E>, E];
};

export const treeMap = <N1, N2, E>(
  { node, childTrees, rightChild }: TreeSimple<N1, E>,
  f: (n: N1) => N2
): TreeSimple<N2, E> => ({
  node: f(node),
  childTrees: childTrees.map(([t, e]) => [treeMap(t, f), e]),
  ...(rightChild
    ? { rightChild: (([t, e]) => [treeMap(t, f), e])(rightChild) }
    : {}),
});

export const treeNodes = <N, E>({
  node,
  rightChild,
  childTrees,
}: TreeSimple<N, E>): N[] => {
  return [
    node,
    ...childTrees.flatMap(([n, _]) => treeNodes(n)),
    ...(rightChild ? treeNodes(rightChild[0]) : []),
  ];
};

export const treeToGraph = <
  N extends { id: string },
  E extends { source: string; target: string }
>(
  tree: TreeSimple<N, E>
): Graph<N, E & { isRight: boolean }> => {
  const [trees, edges] = unzip(
    tree.childTrees
      .map<[TreeSimple<N, E>, E & { isRight: boolean }]>(([t, e]) => [
        t,
        { ...e, ...{ isRight: false } },
      ])
      .concat(
        tree.rightChild
          ? [
              [
                tree.rightChild[0],
                { ...tree.rightChild[1], ...{ isRight: true } },
              ],
            ]
          : []
      )
  );
  return combineGraphs(
    trees.map(treeToGraph).concat({ nodes: [tree.node], edges })
  );
};

export type PrimerTree<T> = TreeSimple<Positioned<PrimerNode<T>>, PrimerEdge>;

export type PrimerTreeNoPos<T> = TreeSimple<PrimerNode<T>, PrimerEdge>;

export type PrimerEdge = Edge<Empty>;

/** Our node type. `Positioned<PrimerNode<T>>` can be safely cast to a ReactFlow `Node`.
 * This is more type safe than using ReactFlow's types directly: this way we can ensure that
 * the `type` field always corresponds to a custom node type we've registered with ReactFlow,
 * and that `data` contains the expected type of data for that type of custom node.
 */
export type PrimerNode<T> = { id: string } & (
  | { type: "primer"; data: PrimerNodeProps<T> }
  | { type: "primer-def-name"; data: PrimerDefNameNodeProps }
);

/** Node properties. */
export type PrimerNodeProps<T> = {
  width: number;
  height: number;
  selected: boolean;
} & (
  | {
      flavor: NodeFlavorTextBody | NodeFlavorPrimBody | NodeFlavorNoBody;
      contents: string;
    }
  | {
      flavor: NodeFlavorBoxBody;
    }
) &
  T;

/** Node properties which are equal for all nodes in a single input tree. */
export type PrimerTreeProps = {
  def: GlobalName;
  nodeType: NodeType;
};

export type PrimerTreePropsOne = {
  nodeType: NodeType;
};

/** Properties for the special definition name node. */
export type PrimerDefNameNodeProps = {
  def: GlobalName;
  selected: boolean;
  width: number;
  height: number;
};

export type Positioned<T> = T & {
  position: { x: number; y: number };
};

/** The empty record (note that `{}` is something different: https://typescript-eslint.io/rules/ban-types/) */
export type Empty = Record<string, never>;
