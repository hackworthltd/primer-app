import {
  GlobalName,
  NodeFlavorBoxBody,
  NodeFlavorNoBody,
  NodeFlavorPrimBody,
  NodeFlavorTextBody,
  NodeType,
} from "@/primer-api";
import { unzip } from "fp-ts/lib/Array";
import { NodeFlavor } from "./Flavor";

/** A generic graph. */
export type Graph<
  N extends { id: string },
  E extends { source: string; target: string }
> = {
  nodes: N[];
  edges: E[];
};

export const graphMap = <
  N1 extends { id: string },
  N2 extends { id: string },
  E extends { source: string; target: string }
>(
  { nodes, edges }: Graph<N1, E>,
  f: (n: N1) => N2
): Graph<N2, E> => ({
  nodes: nodes.map(f),
  edges,
});

export const combineGraphs = <
  N extends { id: string },
  E extends { source: string; target: string }
>(
  gs: Graph<N, E>[]
): Graph<N, E> => {
  const [nodes, edges] = unzip(gs.map(({ nodes, edges }) => [nodes, edges]));
  return { nodes: nodes.flat(), edges: edges.flat() };
};

export type PrimerGraph = Graph<Positioned<PrimerNode>, PrimerEdge>;

export type PrimerGraphNoPos = Graph<PrimerNode, PrimerEdge>;

/** A generic edge-labelled tree. */
export type Tree<N, E> = {
  node: N;
  childTrees: [Tree<N, E>, E][];
  rightChild?: [Tree<N, E>, E];
};

export const treeMap = <N1, N2, E>(
  { node, childTrees, rightChild }: Tree<N1, E>,
  f: (n: N1) => N2
): Tree<N2, E> => ({
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
}: Tree<N, E>): N[] => {
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
  tree: Tree<N, E>
): Graph<N, E & { isRight: boolean }> => {
  const [trees, edges] = unzip(
    tree.childTrees
      .map<[Tree<N, E>, E & { isRight: boolean }]>(([t, e]) => [
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

export type PrimerTree = Tree<Positioned<PrimerNode>, PrimerEdge>;

export type PrimerTreeNoPos = Tree<PrimerNode, PrimerEdge>;

/** Our node type. `Positioned<PrimerNode<T>>` can be safely cast to a ReactFlow `Node`.
 * This is more type safe than using ReactFlow's types directly: this way we can ensure that
 * the `type` field always corresponds to a custom node type we've registered with ReactFlow,
 * and that `data` contains the expected type of data for that type of custom node.
 */
export type PrimerNode<T = unknown> = {
  id: string;
  zIndex: number;
  data: PrimerCommonNodeProps & T;
} & (
  | { type: "primer"; data: PrimerNodeProps }
  | { type: "primer-simple"; data: PrimerSimpleNodeProps }
  | { type: "primer-box"; data: PrimerBoxNodeProps }
  | { type: "primer-def-name"; data: PrimerDefNameNodeProps }
);

export const primerNodeWith = <T>(n: PrimerNode, x: T): PrimerNode<T> =>
  // NB We can't inline this function.
  // For some reason, we need to abstract over the the type of `PrimerNode` in order to please the typechecker.
  (<PN>(n1: PN & { data: PrimerCommonNodeProps }) => ({
    ...n1,
    data: { ...n1.data, ...x },
  }))(n);

/** Node properties. */
export type PrimerNodeProps = {
  nodeType: NodeType;
  syntax: boolean;
  flavor: NodeFlavorTextBody | NodeFlavorPrimBody | NodeFlavorNoBody;
  contents: string;
};

/** Properties for a simple node. */
export type PrimerSimpleNodeProps = {
  nodeType: NodeType;
  flavor: NodeFlavorNoBody;
};

/** Properties for a box node. */
export type PrimerBoxNodeProps = {
  nodeType: NodeType;
  flavor: NodeFlavorBoxBody;
};

/** Properties for the special definition name node. */
export type PrimerDefNameNodeProps = {
  def: GlobalName;
};

/** Properties common to every type of node. */
export type PrimerCommonNodeProps = {
  width: number;
  height: number;
  selected: boolean;
};

/** Our edge type. Much like `PrimerNode`, `PrimerEdge` extends ReactFlow's `Edge`.
 */
export type PrimerEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  className: string;
  zIndex: number;
} & ({ type: "primer"; data: PrimerEdgeProps } | { type: "primer-def-name" });

export type PrimerEdgeProps = { flavor: NodeFlavor };

export type Positioned<T> = T & {
  position: { x: number; y: number };
};

/** The empty record (note that `{}` is something different: https://typescript-eslint.io/rules/ban-types/) */
export type Empty = Record<string, never>;
