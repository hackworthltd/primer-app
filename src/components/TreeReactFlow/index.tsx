import { Def, Tree, Selection } from "@/primer-api";
import {
  ReactFlow,
  Edge,
  Node,
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
  Empty,
  treeToGraph,
  NodeNoPos,
  PrimerDefNameNodeProps,
  NodeFlavor,
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
    node: Node<PrimerNodeProps<PrimerTreeProps> | PrimerDefNameNodeProps>
  ) => void;
  treePadding: number;
  forestLayout: "Horizontal" | "Vertical";
} & NodeParams;

const primerNodeClasses = (selected: boolean, flavor: NodeFlavor) =>
  classNames(
    {
      "ring ring-4 ring-offset-4": selected,
      "flex items-center justify-center rounded-md border-4 text-grey-tertiary":
        true,
    },

    // Note: we use separate functions here to set per-flavor classes,
    // rather than the more conventional object-style assignment,
    // because by using functions, we can use switch statements and get
    // errors from TypeScript if we miss a case.
    flavorClasses(flavor)
  );

const primerNodeContentsClasses = (flavor: NodeFlavor) =>
  classNames(
    {
      "font-code text-sm xl:text-base": true,
    },

    // See note above for `primerNodeClasses`.
    flavorContentClasses(flavor)
  );

const primerNodeLabelClasses = (flavor: NodeFlavor) =>
  classNames(
    {
      "z-20 p-1 absolute rounded-full text-sm xl:text-base": true,
    },

    // See note above for `primerNodeClasses`.
    flavorLabelClasses(flavor)
  );

const PrimerNode = <T,>(p: NodeProps<PrimerNodeProps<T>>) => {
  const handle = (type: HandleType, position: Position) => (
    <Handle
      id={position}
      isConnectable={false}
      type={type}
      position={position}
    />
  );
  return (
    <>
      {handle("target", Position.Top)}
      {handle("target", Position.Left)}
      <div
        className={primerNodeClasses(p.data.selected, p.data.flavor)}
        style={{
          width: p.data.width,
          height: p.data.height,
        }}
      >
        <div className={primerNodeContentsClasses(p.data.flavor)}>
          {p.data.contents}
        </div>
        {p.data.label ? (
          <div className={primerNodeLabelClasses(p.data.flavor)}>
            {p.data.label}
          </div>
        ) : (
          <></>
        )}
      </div>
      {handle("source", Position.Bottom)}
      {handle("source", Position.Right)}
    </>
  );
};

const PrimerDefNameNode = (p: NodeProps<PrimerDefNameNodeProps>) => (
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
);

const primerNodeTypeName = "primer";
const primerDefNameNodeTypeName = "primer-def-name";

const nodeTypes = {
  [primerNodeTypeName]: PrimerNode,
  [primerDefNameNodeTypeName]: PrimerDefNameNode,
};

const treeFlavor = (tree: Tree): NodeFlavor => {
  switch (tree.body.tag) {
    case "PrimBody":
      return tree.body.contents.fst;
    case "TextBody":
      return tree.body.contents.fst;
    case "BoxBody":
      return tree.body.contents.fst;
    case "NoBody":
      return tree.body.contents;
  }
};

const augmentTree = async <T,>(
  tree: Tree,
  p: NodeParams & T
): Promise<
  [
    PrimerTreeNoPos<T>,
    /* Nodes of nested trees, already positioned.
  We have to lay these out first in order to know the dimensions of boxes to be drawn around them.*/
    PrimerGraph<T>[]
  ]
> => {
  const [childTrees, childNested] = await Promise.all(
    tree.childTrees.map((t) => augmentTree(t, p))
  ).then(unzip);
  const makeEdge = (
    child: PrimerTreeNoPos<T>
  ): [PrimerTreeNoPos<T>, Edge<Empty>] => [
    child,
    {
      id: JSON.stringify([tree.nodeId, child.node.id]),
      source: tree.nodeId,
      target: child.node.id,
      className: flavorEdgeClasses(treeFlavor(tree)),
    },
  ];
  const rightChild = await (tree.rightChild
    ? augmentTree(tree.rightChild, p)
    : undefined);
  const [data, nested] = await nodeProps(tree, p);
  return [
    {
      ...(rightChild ? { rightChild: makeEdge(rightChild[0]) } : {}),
      childTrees: childTrees.map((e) => makeEdge(e)),
      node: {
        id: tree.nodeId,
        type: primerNodeTypeName,
        data: { ...p, ...data },
      },
    },
    [...nested, ...childNested.flat(), ...(rightChild?.[1] ?? [])],
  ];
};

class NoFields {}

const nodeProps = async <T,>(
  tree: Tree,
  p: NodeParams & T
): Promise<[PrimerNodeProps<T>, PrimerGraph<T>[]]> => {
  const selected = p.selection?.node?.id?.toString() == tree.nodeId;
  const flavor = treeFlavor(tree);
  // Typescript does not accept the typing
  // const common: Omit<PrimerNodeProps<T>, "contents">
  const common: Omit<PrimerNodeProps<NoFields>, "contents"> & T = {
    label: flavorLabel(flavor),
    width: p.nodeWidth,
    height: p.nodeHeight,
    flavor,
    selected,
    ...p,
  };
  switch (tree.body.tag) {
    case "PrimBody": {
      const prim = tree.body.contents.snd;
      const contents = (() => {
        switch (prim.tag) {
          case "PrimInt":
            return prim.contents.toString();
          case "PrimChar":
            return prim.contents;
        }
      })();
      return [{ contents, ...common }, []];
    }
    case "TextBody":
      return [
        {
          contents: tree.body.contents.snd.baseName,
          ...common,
        },
        [],
      ];
    case "NoBody":
      return [
        {
          contents: noBodyFlavorContents(flavor),
          ...common,
        },
        [],
      ];
    case "BoxBody": {
      const [bodyTree, bodyNested] = await augmentTree(
        tree.body.contents.snd,
        p
      );
      const bodyLayout = await layoutTree(bodyTree).then((layout) => ({
        ...layout,
        ...treeToGraph(layout.tree),
      }));
      return [
        {
          ...common,
          width: bodyLayout.width + p.boxPadding,
          height: bodyLayout.height + p.boxPadding,
          contents: undefined,
        },
        bodyNested.concat({
          nodes: bodyLayout.nodes.map((node) => ({
            ...node,
            parentNode: tree.nodeId,
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
          const defNameNode: NodeNoPos<PrimerDefNameNodeProps> = {
            id: defNodeId,
            data: {
              def: def.name,
              height: p.nodeHeight * 2,
              width: p.nodeWidth * 2,
              selected:
                deepEqual(p.selection?.def, def.name) && !p.selection?.node,
            },
            type: primerDefNameNodeTypeName,
          };
          const defEdge = async (
            tree: Tree,
            augmentParams: NodeParams & PrimerTreeProps,
            edgeId: string
          ): Promise<{
            subtree: [PrimerTreeNoPos<PrimerTreeProps>, Edge<Empty>];
            nested: PrimerGraph<PrimerTreeProps>[];
          }> => {
            const [t, nested] = await augmentTree(tree, augmentParams);
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
    <ReactFlow
      id={id}
      {...(p.onNodeClick && { onNodeClick: p.onNodeClick })}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true, account: "paid-pro" }}
    >
      <Background gap={25} size={1.6} color="#81818a" />
    </ReactFlow>
  );
};

export default TreeReactFlow;

export type TreeReactFlowOneProps = {
  tree?: Tree;
  onNodeClick?: (
    event: React.MouseEvent,
    node: Node<PrimerNodeProps<PrimerTreePropsOne>>
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
        const [tree, nested] = await augmentTree<PrimerTreePropsOne>(pt, {
          nodeType: "BodyNode",
          ...p,
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
    <ReactFlow
      id={id}
      {...(p.onNodeClick && { onNodeClick: p.onNodeClick })}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true, account: "paid-pro" }}
    >
      <Background gap={25} size={1.6} color="#81818a" />
    </ReactFlow>
  );
};
