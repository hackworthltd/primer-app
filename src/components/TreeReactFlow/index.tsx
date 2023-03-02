import { Def, Tree as APITree, Selection, NodeBody } from "@/primer-api";
import {
  ReactFlow,
  Node as RFNode,
  Handle,
  Position,
  NodeProps,
  Background,
  HandleType,
} from "reactflow";
import "./reactflow.css";
import { useEffect, useId, useState } from "react";
import classNames from "classnames";
import { unzip } from "fp-ts/lib/Array";
import {
  combineGraphs,
  PrimerGraph,
  PrimerNodeProps,
  PrimerTreeProps,
  PrimerTreeNoPos,
  PrimerTreePropsOne,
  treeToGraph,
  PrimerDefNameNodeProps,
  PrimerNode,
  PrimerEdge,
  Positioned,
  Tree,
} from "./Types";
import { layoutTree } from "./layoutTree";
import deepEqual from "deep-equal";
import {
  commonHoverClasses,
  flavorClasses,
  flavorContentClasses,
  flavorEdgeClasses,
  flavorLabel,
  flavorLabelClasses,
  noBodyFlavorContents,
} from "./Flavor";
import { assertType, Equal } from "@/util";

type NodeParams = {
  nodeWidth: number;
  nodeHeight: number;
  boxPadding: number;
  selection?: Selection;
};
export type TreeReactFlowProps = {
  defs: Def[];
  onNodeClick?: (
    event: React.MouseEvent,
    node: Positioned<PrimerNode<PrimerTreeProps>>
  ) => void;
  treePadding: number;
  forestLayout: "Horizontal" | "Vertical";
} & NodeParams;

const handle = (type: HandleType, position: Position) => (
  <Handle id={position} isConnectable={false} type={type} position={position} />
);

const nodeTypes = {
  primer: <T,>(p: NodeProps<PrimerNodeProps<T>>) => (
    <>
      {handle("target", Position.Top)}
      {handle("target", Position.Left)}
      <div
        className={classNames(
          {
            "ring-4 ring-offset-4": p.data.selected,
          },
          "flex items-center justify-center rounded-md border-4 text-grey-tertiary",
          flavorClasses(p.data.flavor)
        )}
        style={{
          width: p.data.width,
          height: p.data.height,
        }}
      >
        {"contents" in p.data ? (
          <div
            className={classNames(
              "font-code text-sm xl:text-base",
              flavorContentClasses(p.data.flavor)
            )}
          >
            {p.data.contents}
          </div>
        ) : (
          <></>
        )}
        <div
          className={classNames(
            "z-20 p-1 absolute rounded-full text-sm xl:text-base",
            flavorLabelClasses(p.data.flavor)
          )}
        >
          {flavorLabel(p.data.flavor)}
        </div>
      </div>
      {handle("source", Position.Bottom)}
      {handle("source", Position.Right)}
    </>
  ),
  "primer-def-name": (p: NodeProps<PrimerDefNameNodeProps>) => (
    <>
      <div
        className={classNames(
          "flex items-center justify-center",
          "bg-grey-primary",
          "border-8 border-grey-tertiary ring-grey-tertiary",
          p.data.selected && "ring-4 ring-offset-4",
          commonHoverClasses
        )}
        style={{
          width: p.data.width,
          height: p.data.height,
        }}
      >
        <div className="font-code text-4xl text-grey-tertiary">
          {p.data.def.baseName}
        </div>
      </div>
      <Handle isConnectable={false} type="source" position={Position.Bottom} />
    </>
  ),
};

// Check that `nodeTypes` is in sync with `PrimerNode`,
// i.e. that we register our custom nodes correctly (see `PrimerNode` for further explanation).
assertType<
  Equal<
    PrimerNode<unknown>,
    { id: string } & {
      [T in keyof typeof nodeTypes]: {
        type: T;
        data: Parameters<(typeof nodeTypes)[T]>[0]["data"];
      };
    }[keyof typeof nodeTypes]
  >
>;

/** `APITree` without the children. */
type APITreeNode = {
  nodeId: string;
  body: NodeBody;
};

const augmentTree = async <T, E, Extra>(
  tree: APITree,
  f: (tree: APITreeNode) => Promise<
    [
      T,
      (child: T) => E,
      // Any extra data produced from each node.
      Extra[]
    ]
  >
): Promise<[Tree<T, E>, Extra[]]> => {
  const [childTrees, childExtra] = await Promise.all(
    tree.childTrees.map((t) => augmentTree(t, f))
  ).then(unzip);
  const [node, makeEdge, extra] = await f(tree);
  const rightChild = await (tree.rightChild
    ? augmentTree(tree.rightChild, f)
    : undefined);
  return [
    {
      ...(rightChild
        ? { rightChild: [rightChild[0], makeEdge(rightChild[0].node)] }
        : {}),
      childTrees: childTrees.map((e) => [e, makeEdge(e.node)]),
      node,
    },
    [...extra, ...childExtra.flat(), ...(rightChild?.[1] ?? [])],
  ];
};

const makePrimerNode = async <T,>(
  node: APITreeNode,
  p: NodeParams & T
): Promise<
  [
    PrimerNode<T>,
    (child: PrimerNode<T>) => PrimerEdge,
    /* Nodes of nested trees, already positioned.
    We have to lay these out first in order to know the dimensions of boxes to be drawn around them.*/
    PrimerGraph<T>[]
  ]
> => {
  const selected = p.selection?.node?.id?.toString() == node.nodeId;
  const id = node.nodeId;
  const common = {
    width: p.nodeWidth,
    height: p.nodeHeight,
    selected,
    ...p,
  };
  const edgeCommon = (child: PrimerNode<T>) => ({
    id: JSON.stringify([id, child.id]),
    source: id,
    target: child.id,
  });
  switch (node.body.tag) {
    case "PrimBody": {
      const { fst: flavor, snd: prim } = node.body.contents;
      const contents = (() => {
        switch (prim.tag) {
          case "PrimInt":
            return prim.contents.toString();
          case "PrimChar":
            return prim.contents;
        }
      })();
      return [
        {
          id,
          type: "primer",
          data: {
            flavor,
            contents,
            ...common,
          },
        },
        (child) => ({
          className: flavorEdgeClasses(flavor),
          ...edgeCommon(child),
        }),
        [],
      ];
    }
    case "TextBody": {
      const { fst: flavor, snd: name } = node.body.contents;
      return [
        {
          id,
          type: "primer",
          data: {
            flavor,
            contents: name.baseName,
            ...common,
          },
        },
        (child) => ({
          className: flavorEdgeClasses(flavor),
          ...edgeCommon(child),
        }),
        [],
      ];
    }
    case "NoBody": {
      const flavor = node.body.contents;
      return [
        {
          id,
          type: "primer",
          data: {
            flavor,
            contents: noBodyFlavorContents(node.body.contents),
            ...common,
          },
        },
        (child) => ({
          className: flavorEdgeClasses(flavor),
          ...edgeCommon(child),
        }),
        [],
      ];
    }
    case "BoxBody": {
      const { fst: flavor, snd: t } = node.body.contents;
      const [bodyTree, bodyNested] = await augmentTree(t, (n) =>
        makePrimerNode(n, p)
      );
      const bodyLayout = await layoutTree(bodyTree).then((layout) => ({
        ...layout,
        ...treeToGraph(layout.tree),
      }));
      return [
        {
          id,
          type: "primer",
          data: {
            flavor,
            ...common,
            width: bodyLayout.width + p.boxPadding,
            height: bodyLayout.height + p.boxPadding,
          },
        },
        (child) => ({
          className: flavorEdgeClasses(flavor),
          ...edgeCommon(child),
        }),
        bodyNested.concat({
          nodes: bodyLayout.nodes.map((node) => ({
            ...node,
            parentNode: id,
            position: {
              x: node.position.x + p.boxPadding / 2,
              y: node.position.y + p.boxPadding / 2,
            },
          })),
          edges: bodyLayout.edges,
        }),
      ];
    }
  }
};

// TreeReactFlow renders multiple definitions on one canvas.
// For each definition, it displays three things:
// - the definition's name
// - the definition's type
// - the definition's body (a term)
// It ensures that these are clearly displayed as "one atomic thing",
// i.e. to avoid confused readings that group the type of 'foo' with the body of 'bar' (etc)
export const TreeReactFlow = (p: TreeReactFlowProps) => {
  const [{ nodes, edges }, setLayout] = useState<PrimerGraph<PrimerTreeProps>>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    (async () => {
      const [trees, nested] = await Promise.all(
        p.defs.map<
          Promise<
            [PrimerTreeNoPos<PrimerTreeProps>, PrimerGraph<PrimerTreeProps>[]]
          >
        >(async (def) => {
          const defNodeId = "def-" + def.name.baseName;
          const sigEdgeId = "def-sig-" + def.name.baseName;
          const bodyEdgeId = "def-body-" + def.name.baseName;
          const defNameNode: PrimerNode<unknown> = {
            id: defNodeId,
            data: {
              def: def.name,
              height: p.nodeHeight * 2,
              width: p.nodeWidth * 2,
              selected:
                deepEqual(p.selection?.def, def.name) && !p.selection?.node,
            },
            type: "primer-def-name",
          };
          const defEdge = async (
            tree: APITree,
            augmentParams: NodeParams & PrimerTreeProps,
            edgeId: string
          ): Promise<{
            subtree: [PrimerTreeNoPos<PrimerTreeProps>, PrimerEdge];
            nested: PrimerGraph<PrimerTreeProps>[];
          }> => {
            const [t, nested] = await augmentTree(tree, (n) =>
              makePrimerNode(n, augmentParams)
            );
            return {
              subtree: [
                t,
                {
                  id: edgeId,
                  source: defNodeId,
                  target: tree.nodeId,
                  type: "step",
                  className: "stroke-grey-tertiary stroke-[0.25rem]",
                  style: { strokeDasharray: 4 },
                },
              ],
              nested,
            };
          };
          const sigTree = await defEdge(
            def.type_,
            {
              def: def.name,
              nodeType: "SigNode",
              ...p,
            },
            sigEdgeId
          );
          const bodyTree = await (def.term
            ? defEdge(
                def.term,
                {
                  def: def.name,
                  nodeType: "BodyNode",
                  ...p,
                },
                bodyEdgeId
              )
            : undefined);
          return [
            {
              node: defNameNode,
              childTrees: [
                sigTree.subtree,
                ...(bodyTree ? [bodyTree.subtree] : []),
              ],
            },
            [...sigTree.nested, ...(bodyTree ? bodyTree.nested : [])],
          ];
        })
      ).then(unzip);
      const ts = await Promise.all(trees.map(layoutTree));
      const graphs = ts.reduce<[PrimerGraph<PrimerTreeProps>[], number]>(
        ([gs, offset], { tree, width, height }) => {
          const g = treeToGraph(tree);
          const { increment, offsetVector } = (() => {
            switch (p.forestLayout) {
              case "Horizontal":
                return { increment: width, offsetVector: { x: offset, y: 0 } };
              case "Vertical":
                return { increment: height, offsetVector: { x: 0, y: offset } };
            }
          })();
          return [
            gs.concat({
              edges: g.edges.map(({ isRight, ...e }) => ({
                ...e,
                sourceHandle: isRight ? Position.Right : Position.Bottom,
                targetHandle: isRight ? Position.Left : Position.Top,
              })),
              nodes: g.nodes.map((n) => ({
                ...n,
                position: {
                  x: n.position.x + offsetVector.x,
                  y: n.position.y + offsetVector.y,
                },
              })),
            }),
            offset + increment + p.treePadding,
          ];
        },
        [[], 0]
      )[0];
      setLayout(combineGraphs([...graphs, ...nested.flat()]));
    })();
  }, [p]);

  // ReactFlow requires a unique id to be passed in if there are
  // multiple flows on one page. We simply get react to generate
  // a unique id for us.
  const id = useId();

  return (
    <ReactFlowSafe
      id={id}
      {...(p.onNodeClick && { onNodeClick: p.onNodeClick })}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true, account: "paid-pro" }}
    >
      <Background gap={25} size={1.6} color="#81818a" />
    </ReactFlowSafe>
  );
};

export default TreeReactFlow;

export type TreeReactFlowOneProps = {
  tree?: APITree;
  onNodeClick?: (
    event: React.MouseEvent,
    node: PrimerNode<PrimerTreePropsOne>
  ) => void;
} & NodeParams;

// TreeReactFlowOne renders one Tree (i.e. one type or one term) on its own individual canvas.
// It is essentially a much simpler version of TreeReactFlow.
export const TreeReactFlowOne = (p: TreeReactFlowOneProps) => {
  const [{ nodes, edges }, setLayout] = useState<
    PrimerGraph<PrimerTreePropsOne>
  >({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    const pt = p.tree;
    pt &&
      (async () => {
        const [tree, nested] = await augmentTree(pt, (n) => {
          return makePrimerNode<PrimerTreePropsOne>(n, {
            nodeType: "BodyNode",
            ...p,
          });
        });
        const t = await layoutTree(tree);
        const graph: PrimerGraph<PrimerTreePropsOne> = treeToGraph(t.tree);
        setLayout(combineGraphs([graph, ...nested.flat()]));
      })();
  }, [p]);

  // ReactFlow requires a unique id to be passed in if there are
  // multiple flows on one page. We simply get react to generate
  // a unique id for us.
  const id = useId();

  return (
    <ReactFlowSafe
      id={id}
      {...(p.onNodeClick && { onNodeClick: p.onNodeClick })}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true, account: "paid-pro" }}
    >
      <Background gap={25} size={1.6} color="#81818a" />
    </ReactFlowSafe>
  );
};

/** A more strongly-typed version of the `ReactFlow` component.
 * This allows us to use a more refined node type, and safely act on that type in handlers. */
export const ReactFlowSafe = <N extends RFNode>(
  p: Omit<Parameters<typeof ReactFlow>[0], "onNodeClick" | "nodes"> & {
    nodes: N[];
    onNodeClick?: (e: React.MouseEvent<Element, MouseEvent>, n: N) => void;
  }
): ReturnType<typeof ReactFlow> => (
  <ReactFlow
    {...{
      ...p,
      onNodeClick: (e, n) => {
        "onNodeClick" in p &&
          p.onNodeClick(
            e,
            // This cast is safe because `N` is also the type of elements of the `nodes` field.
            n as N
          );
      },
    }}
  ></ReactFlow>
);
