import { GlobalName, NodeFlavor, NodeType } from "@/primer-api";
import { Edge, Node } from "reactflow";
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

export type PrimerGraph<T> = Graph<
  Node<PrimerNodeProps<T> | PrimerDefNameNodeProps>,
  Edge<Empty>
>;

export type PrimerGraphNoPos<T> = Graph<
  NodeNoPos<PrimerNodeProps<T> | PrimerDefNameNodeProps>,
  Edge<Empty>
>;

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
): Graph<N, E> => {
  const [trees, edges] = unzip(
    tree.childTrees.concat(tree.rightChild ? [tree.rightChild] : [])
  );
  return combineGraphs(
    trees.map(treeToGraph).concat({ nodes: [tree.node], edges })
  );
};

export type PrimerTree<T> = TreeSimple<
  Node<PrimerNodeProps<T> | PrimerDefNameNodeProps>,
  Edge<Empty>
>;

export type PrimerTreeNoPos<T> = TreeSimple<
  NodeNoPos<PrimerNodeProps<T> | PrimerDefNameNodeProps>,
  Edge<Empty>
>;

/** Node properties. */
export type PrimerNodeProps<T> = {
  label?: string;
  contents: string | undefined;
  width: number;
  height: number;
  flavor: NodeFlavor;
  selected: boolean;
} & T;

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

export type NodeNoPos<T> = Omit<Node<T>, "position">;

/** The empty record (note that `{}` is something different: https://typescript-eslint.io/rules/ban-types/) */
export type Empty = Record<string, never>;
