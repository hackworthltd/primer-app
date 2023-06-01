import {
  Def,
  Tree as APITree,
  Selection,
  NodeBody,
  GlobalName,
  NodeType,
  Level,
} from "@/primer-api";
import {
  ReactFlow,
  Node as RFNode,
  Edge as RFEdge,
  Handle,
  Position,
  NodeProps,
  Background,
  HandleType,
  getSmoothStepPath,
  EdgeProps,
  getBezierPath,
  EdgeTypes,
  useReactFlow,
} from "reactflow";
import "./reactflow.css";
import { MutableRefObject, useEffect, useId, useState } from "react";
import classNames from "classnames";
import { unzip } from "fp-ts/lib/Array";
import {
  combineGraphs,
  PrimerGraph,
  PrimerNodeProps,
  treeToGraph,
  PrimerDefNameNodeProps,
  PrimerNode,
  PrimerEdge,
  Positioned,
  Tree,
  Graph,
  treeMap,
  primerNodeWith,
  graphMap,
  PrimerSimpleNodeProps,
  PrimerBoxNodeProps,
  PrimerCommonNodeProps,
  treeNodes,
  PrimerEdgeProps,
} from "./Types";
import { LayoutParams, layoutTree } from "./layoutTree";
import deepEqual from "deep-equal";
import {
  boxFlavorBackground,
  commonHoverClasses,
  flavorClasses,
  flavorContentClasses,
  flavorEdgeClasses,
  flavorLabel,
  flavorLabelClasses,
  noBodyFlavorContents,
} from "./Flavor";
import { ZoomBar } from "./ZoomBar";
import { WasmLayoutType } from "@zxch3n/tidy/wasm_dist";

export type ScrollToDef = (defName: string) => void;

/** These properties are needed to construct nodes, but are invariant across all nodes. */
type NodeParams = {
  nodeWidth: number;
  nodeHeight: number;
  boxPadding: number;
  selection?: Selection;
  level: Level;
};
export type TreeReactFlowProps = {
  defs: Def[];
  onNodeClick?: (
    event: React.MouseEvent,
    node: Positioned<PrimerNodeWithDef>
  ) => void;
  treePadding: number;
  forestLayout: "Horizontal" | "Vertical";
  defNameNodeSizeMultipliers: { width: number; height: number };
  layout: LayoutParams;
  scrollToDefRef: MutableRefObject<ScrollToDef | undefined>;
} & NodeParams;
export const defaultTreeReactFlowProps: Pick<
  TreeReactFlowProps,
  | "treePadding"
  | "forestLayout"
  | "defNameNodeSizeMultipliers"
  | "layout"
  | keyof NodeParams
> = {
  level: "Expert",
  forestLayout: "Horizontal",
  treePadding: 100,
  nodeWidth: 80,
  nodeHeight: 35,
  boxPadding: 50,
  defNameNodeSizeMultipliers: { width: 3, height: 2 },
  layout: {
    type: WasmLayoutType.Tidy,
    margins: { child: 25, sibling: 18 },
  },
};

// This should probably take a `GlobalName` instead, but we're not
// quite there yet.
const defNameToNodeId = (name: string) => `def-${name}`;

const handle = (type: HandleType, position: Position) => (
  <Handle id={position} isConnectable={false} type={type} position={position} />
);

const nodeTypes = {
  primer: ({ data }: { data: PrimerNodeProps & PrimerCommonNodeProps }) => (
    <>
      {handle("target", Position.Top)}
      {handle("target", Position.Left)}
      <div
        className={classNames(
          {
            "ring-4 ring-offset-4": data.selected,
            "hover:ring-opacity-50": !data.selected,
          },
          "flex items-center justify-center rounded-md border-4 text-grey-tertiary",
          flavorClasses(data.flavor)
        )}
        style={{
          width: data.width,
          height: data.height,
        }}
      >
        <div
          className={classNames(
            "font-code text-sm xl:text-base",
            flavorContentClasses(data.flavor)
          )}
        >
          {data.contents}
        </div>
        <div
          className={classNames(
            "z-20 p-1 absolute rounded-full text-sm xl:text-base",
            data.syntax ? "-top-4" : "-right-2 -top-4",
            flavorLabelClasses(data.flavor)
          )}
        >
          {flavorLabel(data.flavor)}
        </div>
      </div>
      {handle("source", Position.Bottom)}
      {handle("source", Position.Right)}
    </>
  ),
  "primer-simple": ({
    data,
  }: {
    data: PrimerSimpleNodeProps & PrimerCommonNodeProps;
  }) => (
    <>
      {handle("target", Position.Top)}
      {handle("target", Position.Left)}
      <div
        className={classNames(
          {
            "ring-4 ring-offset-4": data.selected,
            "hover:ring-opacity-50": !data.selected,
          },
          "flex items-center justify-center rounded-md border-4 text-grey-tertiary",
          flavorClasses(data.flavor)
        )}
        style={{
          width: data.width,
          height: data.height,
        }}
      >
        {
          <div
            className={classNames(
              "font-code text-sm xl:text-base",
              flavorContentClasses(data.flavor)
            )}
          >
            {flavorLabel(data.flavor)}
          </div>
        }
      </div>
      {handle("source", Position.Bottom)}
      {handle("source", Position.Right)}
    </>
  ),
  "primer-box": ({
    data,
  }: {
    data: PrimerBoxNodeProps & PrimerCommonNodeProps;
  }) => (
    <>
      {handle("target", Position.Top)}
      {handle("target", Position.Left)}
      <div
        className={classNames(
          "flex justify-center rounded-md border-4",
          flavorClasses(data.flavor),
          // We use a white base so that the "transparent" background will not appear as such.
          "bg-white-primary"
        )}
        style={{
          width: data.width,
          height: data.height,
        }}
      >
        <div
          className={classNames(
            "bg-opacity-20 w-full",
            boxFlavorBackground(data.flavor)
          )}
        ></div>
        <div
          className={classNames(
            "z-20 p-1 absolute rounded-full text-sm xl:text-base",
            "-top-4",
            flavorLabelClasses(data.flavor)
          )}
        >
          {flavorLabel(data.flavor)}
        </div>
      </div>
      {handle("source", Position.Bottom)}
      {handle("source", Position.Right)}
    </>
  ),
  "primer-def-name": ({
    data,
  }: {
    data: PrimerDefNameNodeProps & PrimerCommonNodeProps;
  }) => (
    <>
      <div
        className={classNames(
          "flex items-center justify-center",
          "rounded-md",
          "bg-grey-primary",
          "border-8 border-grey-tertiary ring-grey-tertiary",
          data.selected && "ring-4 ring-offset-4",
          commonHoverClasses,
          "hover:ring-grey-tertiary",
          !data.selected && "hover:ring-opacity-50"
        )}
        style={{
          width: data.width,
          height: data.height,
        }}
      >
        <div className="font-code text-4xl text-grey-tertiary">
          {data.def.baseName}
        </div>
      </div>
      {handle("source", Position.Bottom)}
    </>
  ),
};

const edgeTypes = {
  primer: ({
    data,
    id,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  }: EdgeProps<unknown> & { data: PrimerEdgeProps }) => {
    const [edgePath] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
    return (
      <path
        id={id}
        className={classNames(
          "fill-none stroke-[0.25rem]",
          flavorEdgeClasses(data.flavor)
        )}
        d={edgePath}
      />
    );
  },
  "primer-def-name": ({
    id,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  }: EdgeProps<unknown>) => {
    const [edgePath] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      offset: 0,
    });
    return (
      <path
        id={id}
        className={"fill-none stroke-grey-tertiary stroke-[0.25rem]"}
        style={{ strokeDasharray: 4 }}
        d={edgePath}
      />
    );
  },
};

/** `APITree` without the children. */
type APITreeNode = {
  nodeId: string;
  body: NodeBody;
  children: number;
};

const augmentTree = async <T, E>(
  tree: APITree,
  f: (tree: APITreeNode) => Promise<[T, (child: T, isRight: boolean) => E]>
): Promise<Tree<T, E>> => {
  const childTrees = await Promise.all(
    tree.childTrees.map((t) => augmentTree(t, f))
  );
  const [node, makeEdge] = await f({
    children: tree.childTrees.length + (tree.rightChild ? 1 : 0),
    ...tree,
  });
  const rightChild = await (tree.rightChild
    ? augmentTree(tree.rightChild, f)
    : undefined);
  return {
    ...(rightChild
      ? { rightChild: [rightChild, makeEdge(rightChild.node, true)] }
      : {}),
    childTrees: childTrees.map((e) => [e, makeEdge(e.node, false)]),
    node,
  };
};

const makePrimerNode = async (
  node: APITreeNode,
  p: NodeParams,
  layout: LayoutParams,
  zIndex: number,
  nodeType: NodeType
): Promise<
  [
    PrimerNode,
    (child: PrimerNode, isRight: boolean) => PrimerEdge,
    /* Nodes of nested trees, already positioned.
    We have to lay these out first in order to know the dimensions of boxes to be drawn around them.*/
    PrimerGraph[]
  ]
> => {
  const selected = p.selection?.node?.id?.toString() == node.nodeId;
  const id = node.nodeId;
  const common = {
    width: p.nodeWidth,
    height: p.nodeHeight,
    selected,
    nodeType,
  };
  const edgeCommon = (
    child: PrimerNode,
    isRight: boolean
  ): Omit<PrimerEdge, "className" | "type" | "data"> => ({
    id: JSON.stringify([id, child.id]),
    source: id,
    target: child.id,
    zIndex,
    sourceHandle: isRight ? Position.Right : Position.Bottom,
    targetHandle: isRight ? Position.Left : Position.Top,
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
            syntax: false,
            ...common,
          },
          zIndex,
        },
        (child, isRight) => ({
          type: "primer",
          data: { flavor },
          className: flavorEdgeClasses(flavor),
          ...edgeCommon(child, isRight),
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
            syntax: false,
            ...common,
          },
          zIndex,
        },
        (child, isRight) => ({
          type: "primer",
          data: { flavor },
          className: flavorEdgeClasses(flavor),
          ...edgeCommon(child, isRight),
        }),
        [],
      ];
    }
    case "NoBody": {
      const flavor = node.body.contents;
      const makeChild = (child: PrimerNode, isRight: boolean): PrimerEdge => ({
        type: "primer",
        data: { flavor },
        ...edgeCommon(child, isRight),
      });
      if (p.level == "Beginner") {
        return [
          {
            id,
            type: "primer",
            data: {
              flavor,
              contents: noBodyFlavorContents(node.body.contents),
              syntax: node.children >= 2,
              ...common,
              // TODO This is necessary to ensure that all syntax labels fit.
              // It can be removed when we have dynamic node sizes.
              width: 130,
            },
            zIndex,
          },
          makeChild,
          [],
        ];
      } else {
        return [
          {
            id,
            type: "primer-simple",
            data: {
              flavor,
              ...common,
              // Square, with same height as other nodes.
              width: common.height,
            },
            zIndex,
          },
          makeChild,
          [],
        ];
      }
    }
    case "BoxBody": {
      const { fst: flavor, snd: t } = node.body.contents;
      const bodyTree = await augmentTree(t, (n0) =>
        makePrimerNode(n0, p, layout, zIndex + 1, nodeType).then(
          ([n, e, nested]) => [primerNodeWith(n, { nested }), e]
        )
      );
      const bodyNested = treeNodes(bodyTree).flatMap((n) => n.data.nested);
      const bodyLayout = await layoutTree(bodyTree, layout).then((layout) => ({
        ...layout,
        ...treeToGraph(layout.tree),
      }));
      return [
        {
          id,
          type: "primer-box",
          data: {
            flavor,
            ...common,
            width: bodyLayout.width + p.boxPadding,
            height: bodyLayout.height + p.boxPadding,
          },
          zIndex,
        },
        (child, isRight) => ({
          type: "primer",
          data: { flavor },
          className: flavorEdgeClasses(flavor),
          ...edgeCommon(child, isRight),
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

type PrimerNodeWithDefNoPos = PrimerNode<{ def: GlobalName }>;
type PrimerNodeWithDef = Positioned<PrimerNodeWithDefNoPos>;

// TreeReactFlow renders multiple definitions on one canvas.
// For each definition, it displays three things:
// - the definition's name
// - the definition's type
// - the definition's body (a term)
// It ensures that these are clearly displayed as "one atomic thing",
// i.e. to avoid confused readings that group the type of 'foo' with the body of 'bar' (etc)
export const TreeReactFlow = (p: TreeReactFlowProps) => {
  const [{ nodes, edges }, setLayout] = useState<
    Graph<PrimerNodeWithDef, PrimerEdge>
  >({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    (async () => {
      const [trees, nested] = await Promise.all(
        p.defs.map<
          Promise<
            [
              Tree<PrimerNodeWithDefNoPos, PrimerEdge>,
              Graph<PrimerNodeWithDef, PrimerEdge>[]
            ]
          >
        >(async (def) => {
          const defNodeId = defNameToNodeId(def.name.baseName);
          const sigEdgeId = "def-sig-" + def.name.baseName;
          const bodyEdgeId = "def-body-" + def.name.baseName;
          const defNameNode: PrimerNode = {
            id: defNodeId,
            data: {
              def: def.name,
              width: p.nodeWidth * p.defNameNodeSizeMultipliers.width,
              height: p.nodeHeight * p.defNameNodeSizeMultipliers.height,
              selected:
                deepEqual(p.selection?.def, def.name) && !p.selection?.node,
            },
            type: "primer-def-name",
            zIndex: 0,
          };
          const defEdge = async (
            tree: APITree,
            nodeParams: NodeParams,
            nodeType: NodeType,
            edgeId: string
          ): Promise<{
            subtree: [Tree<PrimerNodeWithDefNoPos, PrimerEdge>, PrimerEdge];
            nested: Graph<PrimerNodeWithDef, PrimerEdge>[];
          }> => {
            const t = await augmentTree(tree, (n0) =>
              makePrimerNode(n0, nodeParams, p.layout, 0, nodeType).then(
                ([n, e, nested]) => [primerNodeWith(n, { nested }), e]
              )
            );
            const nested = treeNodes(t).flatMap((n) => n.data.nested);
            return {
              subtree: [
                treeMap(t, (n) => primerNodeWith(n, { def: def.name })),
                {
                  id: edgeId,
                  source: defNodeId,
                  target: tree.nodeId,
                  type: "primer-def-name",
                  zIndex: 0,
                  sourceHandle: Position.Bottom,
                  targetHandle: Position.Top,
                },
              ],
              nested: nested.map((g) =>
                graphMap(g, ({ position, ...n }) => ({
                  position,
                  ...primerNodeWith(n, { def: def.name }),
                }))
              ),
            };
          };
          const sigTree = await defEdge(def.type_, p, "SigNode", sigEdgeId);
          const bodyTree = await (def.term
            ? defEdge(def.term, p, "BodyNode", bodyEdgeId)
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
      const ts = await Promise.all(trees.map((t) => layoutTree(t, p.layout)));
      const graphs = ts.reduce<
        [Graph<PrimerNodeWithDef, PrimerEdge>[], number]
      >(
        ([gs, offset], { tree, width, height }) => {
          const { nodes, edges } = treeToGraph(tree);
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
              edges,
              nodes: nodes.map((n) => ({
                ...n,
                position: {
                  x: n.position.x + p.layout.margins.sibling + offsetVector.x,
                  y: n.position.y + p.layout.margins.child + offsetVector.y,
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
    <ReactFlowSafe<PrimerNodeWithDef, PrimerEdge>
      id={id}
      {...(p.onNodeClick && { onNodeClick: p.onNodeClick })}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      proOptions={{ hideAttribution: true, account: "paid-pro" }}
    >
      <Background gap={25} size={1.6} color="#81818a" />
      <ZoomBar />
      <SetTreeReactFlowCallbacks scrollToDefRef={p.scrollToDefRef} />
    </ReactFlowSafe>
  );
};

// This component is rendered purely for side effects. We do this
// rather than wrap our `ReactFlow` components with
// `ReactFlowProvider`s.
const SetTreeReactFlowCallbacks = ({
  scrollToDefRef,
}: {
  scrollToDefRef: MutableRefObject<ScrollToDef | undefined>;
}) => {
  const { fitView, getZoom } = useReactFlow();
  const scrollToDef: ScrollToDef = (defName: string) => {
    // Don't change the current zoom level when scrolling to a
    // definition.
    const zoomLevel: number = getZoom();
    fitView({
      nodes: [{ id: defNameToNodeId(defName) }],
      minZoom: zoomLevel,
      maxZoom: zoomLevel,
    });
  };
  scrollToDefRef.current = scrollToDef;
  return <></>;
};

export default TreeReactFlow;

export type TreeReactFlowOneProps = {
  tree?: APITree;
  onNodeClick?: (event: React.MouseEvent, node: PrimerNode) => void;
  layout: LayoutParams;
} & NodeParams;

// TreeReactFlowOne renders one Tree (i.e. one type or one term) on its own individual canvas.
// It is essentially a much simpler version of TreeReactFlow.
export const TreeReactFlowOne = (p: TreeReactFlowOneProps) => {
  const [{ nodes, edges }, setLayout] = useState<PrimerGraph>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    const pt = p.tree;
    pt &&
      (async () => {
        const tree = await augmentTree(pt, (n0) =>
          makePrimerNode(n0, p, p.layout, 0, "BodyNode").then(
            ([n, e, nested]) => [primerNodeWith(n, { nested }), e]
          )
        );
        const nested = treeNodes(tree).flatMap((n) => n.data.nested);
        const t = await layoutTree(tree, p.layout);
        const graph = treeToGraph(t.tree);
        setLayout(combineGraphs([graph, ...nested.flat()]));
      })();
  }, [p]);

  // ReactFlow requires a unique id to be passed in if there are
  // multiple flows on one page. We simply get react to generate
  // a unique id for us.
  const id = useId();

  return (
    <ReactFlowSafe<Positioned<PrimerNode>, PrimerEdge>
      id={id}
      {...(p.onNodeClick && { onNodeClick: p.onNodeClick })}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      proOptions={{ hideAttribution: true, account: "paid-pro" }}
    >
      <Background gap={25} size={1.6} color="#81818a" />
      <ZoomBar />
    </ReactFlowSafe>
  );
};

/** A more strongly-typed version of the `ReactFlow` component.
 * This allows us to use a more refined node type,
 * check that we register its subtypes correctly with ReactFlow,
 * and safely act on that type in handlers. */
export const ReactFlowSafe = <
  N extends RFNode & { type: string },
  E extends RFEdge & { type: string }
>(
  p: Omit<Parameters<typeof ReactFlow>[0], "onNodeClick" | "edgeTypes"> & {
    nodes: N[];
    nodeTypes: {
      [T in N["type"]]: (
        args: NodeProps<unknown> & N & { type: T }
      ) => JSX.Element;
    };
    edgeTypes: {
      [T in E["type"]]: (
        args: EdgeProps<unknown> & E & { type: T }
      ) => JSX.Element;
    };
    onNodeClick?: (e: React.MouseEvent<Element, MouseEvent>, n: N) => void;
  }
): ReturnType<typeof ReactFlow> => {
  // @ts-expect-error: ReactFlow's `EdgeTypes` is poorly-typed: it wants entries to be able to handle
  // `EdgeProps<any>`, and doesn't consider it an instance of types such as `EdgeProps<unknown> & { data: T }`.
  // NB. with `NodeTypes`, this isn't an issue: TS can handle the coercion because `NodeProps`'s `data` field
  // is non-optional, unlike `EdgeProps`'s.
  const edgeTypes: EdgeTypes = p.edgeTypes;
  return (
    <ReactFlow
      {...{
        ...p,
        fitView: true,
        // Note: we should try to detect this based on the bounding
        // box of the canvas.
        minZoom: 0.001,
        edgeTypes,
        nodesDraggable: false,
        // Note that despite the name, we can still select nodes in
        // the tree in order to perform actions on them.
        elementsSelectable: false,
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
};
