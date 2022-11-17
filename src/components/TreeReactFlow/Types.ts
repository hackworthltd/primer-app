import { GlobalName, NodeFlavor, NodeType } from "@/primer-api";
import { Edge, Node } from "react-flow-renderer/nocss";
import { unzip } from "fp-ts/lib/Array";

/** A generic graph. */
export type Graph<N, E> = {
  nodes: N[];
  edges: E[];
};

export const combineGraphs = <N, E>(gs: Graph<N, E>[]): Graph<N, E> => {
  const [nodes, edges] = unzip(gs.map(({ nodes, edges }) => [nodes, edges]));
  return { nodes: nodes.flat(), edges: edges.flat() };
};

export type PrimerGraph = Graph<Node<PrimerNodeProps>, Edge<Empty>>;

export type PrimerGraphNoPos = Graph<NodeNoPos<PrimerNodeProps>, Edge<Empty>>;

/** A generic edge-labelled tree. */
export type TreeSimple<N, E> = {
  node: N;
  childTrees: [TreeSimple<N, E>, E][];
  rightChild?: [TreeSimple<N, E>, E];
};

export const treeToGraph = <N, E>(tree: TreeSimple<N, E>): Graph<N, E> => {
  const [trees, edges] = unzip(
    tree.childTrees.concat(tree.rightChild ? [tree.rightChild] : [])
  );
  return combineGraphs(
    trees.map(treeToGraph).concat({ nodes: [tree.node], edges })
  );
};

export type PrimerTree = TreeSimple<Node<PrimerNodeProps>, Edge<Empty>>;

export type PrimerTreeNoPos = TreeSimple<
  NodeNoPos<PrimerNodeProps>,
  Edge<Empty>
>;

/** Node properties. */
export type PrimerNodeProps = {
  label?: string;
  contents: string | undefined;
  width: number;
  height: number;
  flavor: NodeFlavor;
  selected: boolean;
} & PrimerTreeProps;

/** Node properties which are equal for all nodes in a single tree. */
export type PrimerTreeProps = {
  def: GlobalName;
  nodeType: NodeType;
};

export type NodeNoPos<T> = Omit<Node<T>, "position">;

/** The empty record (note that `{}` is something different: https://typescript-eslint.io/rules/ban-types/) */
export type Empty = Record<string, never>;
