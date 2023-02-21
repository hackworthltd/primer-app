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

const commonHoverClasses =
  " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-green-primary";

const flavorClasses = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "Hole":
      return "border-red-tertiary ring-red-tertiary bg-white-primary".concat(
        commonHoverClasses
      );
    case "EmptyHole":
      return "border-red-tertiary ring-red-tertiary bg-white-primary".concat(
        commonHoverClasses
      );
    case "Ann":
      return "border-black-primary ring-black-primary bg-black-primary".concat(
        commonHoverClasses
      );
    case "App":
      return "border-blue-tertiary ring-blue-tertiary bg-blue-tertiary".concat(
        commonHoverClasses
      );
    case "APP":
      return "border-yellow-secondary ring-yellow-secondary bg-yellow-secondary".concat(
        commonHoverClasses
      );
    case "Con":
      return "border-green-primary ring-green-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "Lam":
      return "border-blue-primary ring-blue-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "LAM":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "GlobalVar":
      return "border-blue-quaternary ring-blue-quaternary bg-white-primary".concat(
        commonHoverClasses
      );
    case "LocalVar":
      return "border-blue-quaternary ring-blue-quaternary bg-white-primary".concat(
        commonHoverClasses
      );
    case "Let":
      return "border-blue-quaternary ring-blue-quaternary bg-blue-quaternary".concat(
        commonHoverClasses
      );
    case "LetType":
      return "border-blue-quaternary ring-blue-quaternary bg-blue-quaternary".concat(
        commonHoverClasses
      );
    case "Letrec":
      return "border-blue-quaternary ring-blue-quaternary bg-blue-quaternary".concat(
        commonHoverClasses
      );
    case "Case":
      return "border-yellow-primary ring-yellow-primary bg-yellow-primary".concat(
        commonHoverClasses
      );

    // Note: not selectable.
    case "CaseWith":
      return "border-yellow-primary ring-yellow-primary bg-yellow-primary";

    case "PrimCon":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "TEmptyHole":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "THole":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "TCon":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "TFun":
      return "border-black-primary ring-black-primary bg-black-primary".concat(
        commonHoverClasses
      );
    case "TVar":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "TApp":
      return "border-black-primary ring-black-primary bg-black-primary".concat(
        commonHoverClasses
      );
    case "TForall":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "TLet":
      return "border-black-primary ring-black-primary bg-black-primary".concat(
        commonHoverClasses
      );

    // Note: most parts of patterns aren't selectable.

    // This node's background is transparent, so that we can draw
    // edges over it. Otherwise, we'd need to special-case the
    // z-index of edges when drawn inside a pattern.
    case "Pattern":
      return "border-yellow-primary ring-yellow-primary";

    case "PatternCon":
      return "border-green-primary ring-green-primary bg-white-primary";
    case "PatternBind":
      return "border-blue-quaternary ring-blue-quaternary bg-white-primary".concat(
        commonHoverClasses
      );
    case "PatternApp":
      return "border-blue-tertiary ring-blue-tertiary bg-blue-tertiary";
  }
};

const flavorContentClasses = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "Hole":
      return "text-blue-primary";
    case "EmptyHole":
      return "text-blue-primary";
    case "Ann":
      return "text-white-primary";
    case "App":
      return "text-white-primary";
    case "APP":
      return "text-white-primary";
    case "Con":
      return "text-blue-primary";
    case "Lam":
      return "text-blue-primary";
    case "LAM":
      return "text-blue-primary";
    case "GlobalVar":
      return "text-blue-primary";
    case "LocalVar":
      return "text-blue-primary";
    case "Let":
      return "text-white-primary";
    case "LetType":
      return "text-white-primary";
    case "Letrec":
      return "text-white-primary";
    case "Case":
      return "text-white-primary";
    case "CaseWith":
      return "text-white-primary";
    case "PrimCon":
      return "text-blue-primary";
    case "TEmptyHole":
      return "text-blue-primary";
    case "THole":
      return "text-blue-primary";
    case "TCon":
      return "text-blue-primary";
    case "TFun":
      return "text-white-primary";
    case "TVar":
      return "text-blue-primary";
    case "TApp":
      return "text-white-primary";
    case "TForall":
      return "text-blue-primary";
    case "TLet":
      return "text-white-primary";

    // Note: has no text content, so this is somewhat meaningless.
    case "Pattern":
      return "text-blue-primary";

    case "PatternCon":
      return "text-blue-primary";
    case "PatternBind":
      return "text-blue-primary";
    case "PatternApp":
      return "text-white-primary";
  }
};

const flavorLabelClasses = (flavor: NodeFlavor): string => {
  const syntaxClasses = " -top-4";
  const exprClasses = " -right-2 -top-4";

  switch (flavor) {
    case "Hole":
      return "font-code bg-red-tertiary border-red-tertiary text-white-primary".concat(
        exprClasses
      );
    case "EmptyHole":
      return "font-code bg-red-tertiary border-red-tertiary text-white-primary".concat(
        exprClasses
      );
    case "Ann":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        syntaxClasses
      );
    case "App":
      return "font-code bg-blue-tertiary border-blue-tertiary text-white-primary".concat(
        syntaxClasses
      );
    case "APP":
      return "font-code bg-yellow-secondary border-yellow-secondary text-white-primary".concat(
        syntaxClasses
      );
    case "Con":
      return "bg-green-primary border-green-primary text-white-primary".concat(
        exprClasses
      );
    case "Lam":
      return "font-code bg-blue-primary border-blue-primary text-white-primary".concat(
        exprClasses
      );
    case "LAM":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        exprClasses
      );
    case "GlobalVar":
      return "bg-blue-quaternary border-blue-quaternary text-white-primary".concat(
        exprClasses
      );
    case "LocalVar":
      return "bg-blue-quaternary border-blue-quaternary text-white-primary".concat(
        exprClasses
      );
    case "Let":
      return "font-code bg-blue-quaternary border-blue-quaternary text-white-primary".concat(
        syntaxClasses
      );
    case "LetType":
      return "font-code bg-blue-quaternary border-blue-quaternary text-white-primary".concat(
        syntaxClasses
      );
    case "Letrec":
      return "font-code bg-blue-quaternary border-blue-quaternary text-white-primary".concat(
        syntaxClasses
      );
    case "Case":
      return "font-code bg-yellow-primary border-yellow-primary text-white-primary".concat(
        syntaxClasses
      );

    // Special case: we hide this label.
    case "CaseWith":
      return "hidden font-code bg-yellow-primary border-yellow-primary text-white-primary".concat(
        syntaxClasses
      );

    case "PrimCon":
      return "bg-black-primary border-black-primary text-white-primary".concat(
        exprClasses
      );
    case "TEmptyHole":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        exprClasses
      );
    case "THole":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        exprClasses
      );
    case "TCon":
      return "bg-black-primary border-black-primary text-white-primary".concat(
        exprClasses
      );
    case "TFun":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        syntaxClasses
      );
    case "TVar":
      return "bg-black-primary border-black-primary text-white-primary".concat(
        exprClasses
      );
    case "TApp":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        syntaxClasses
      );
    case "TForall":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        exprClasses
      );
    case "TLet":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        syntaxClasses
      );
    case "Pattern":
      return "bg-yellow-primary border-yellow-primary text-white-primary".concat(
        syntaxClasses
      );
    case "PatternCon":
      return "bg-green-primary border-green-primary text-white-primary".concat(
        exprClasses
      );
    case "PatternBind":
      return "bg-blue-quaternary border-blue-quaternary text-white-primary".concat(
        exprClasses
      );
    case "PatternApp":
      return "font-code bg-blue-tertiary border-blue-tertiary text-white-primary".concat(
        syntaxClasses
      );
  }
};

const flavorEdgeClasses = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "Hole":
      return "stroke-red-tertiary stroke-[0.25rem] z-10";
    case "EmptyHole":
      return "stroke-red-tertiary stroke-[0.25rem] z-10";
    case "Ann":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "App":
      return "stroke-blue-tertiary stroke-[0.25rem] z-10";
    case "APP":
      return "stroke-yellow-secondary stroke-[0.25rem] z-10";
    case "Con":
      return "stroke-green-primary stroke-[0.25rem] z-10";
    case "Lam":
      return "stroke-blue-primary stroke-[0.25rem] z-10";
    case "LAM":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "GlobalVar":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "LocalVar":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "Let":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "LetType":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "Letrec":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "Case":
      return "stroke-yellow-primary stroke-[0.25rem] z-10";
    case "CaseWith":
      return "stroke-yellow-primary stroke-[0.25rem] z-10";
    case "PrimCon":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "TEmptyHole":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "THole":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "TCon":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "TFun":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "TVar":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "TApp":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "TForall":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "TLet":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "Pattern":
      return "stroke-yellow-primary stroke-[0.25rem] z-10";
    case "PatternCon":
      return "stroke-green-primary stroke-[0.25rem] z-10";
    case "PatternBind":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "PatternApp":
      return "stroke-blue-tertiary stroke-[0.25rem] z-10";
  }
};

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

function flavorLabel(flavor: NodeFlavor): string {
  switch (flavor) {
    case "Hole":
      return "{?}";
    case "EmptyHole":
      return "?";
    case "Ann":
      return ":";
    case "App":
      return "$";
    case "APP":
      return "@";
    case "Con":
      return "V";
    case "Lam":
      return "λ";
    case "LAM":
      return "Λ";
    case "GlobalVar":
      return "Var";
    case "LocalVar":
      return "Var";
    case "Let":
      return "let";
    case "LetType":
      return "let type";
    case "Letrec":
      return "let rec";
    case "Case":
      return "m";
    case "CaseWith":
      return "w";
    case "PrimCon":
      return "V";
    case "TEmptyHole":
      return "?";
    case "THole":
      return "{?}";
    case "TCon":
      return "T";
    case "TFun":
      return "→";
    case "TVar":
      return "Var";
    case "TApp":
      return "@";
    case "TForall":
      return "∀";
    case "TLet":
      return "let";
    case "Pattern":
      return "P";
    case "PatternCon":
      return "V";
    case "PatternBind":
      return "Var";
    case "PatternApp":
      return "$";
  }
}

const noBodyFlavorContents = (flavor: NodeFlavor): string | undefined => {
  switch (flavor) {
    case "Ann":
      return "type annotation";
    case "App":
      return "apply";
    case "APP":
      return "apply type";
    case "Let":
      return "let";
    case "LetType":
      return "let type";
    case "Letrec":
      return "let rec";
    case "Case":
      return "match";
    case "CaseWith":
      return "with";
    case "TFun":
      return "function type";
    case "TApp":
      return "apply type";
    case "TLet":
      return "let type";
    case "PatternApp":
      return "apply";
    case "Hole":
      return "{?}";
    case "EmptyHole":
      return "?";
    case "TEmptyHole":
      return "?";
    case "THole":
      return "{?}";
    default:
      return undefined;
  }
};

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
