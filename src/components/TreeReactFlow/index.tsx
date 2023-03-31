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
} from "reactflow";
import "./reactflow.css";
import { useId } from "react";
import classNames from "classnames";
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
import { usePromise } from "@/util";

/** These properties are needed to construct nodes, but are invariant across all nodes. */
type NodeParams = {
  nodeWidth: number;
  nodeHeight: number;
  boxPadding: number;
  selection?: Selection;
  level: Level;
};
type DefParams = {
  nameNodeMultipliers: { width: number; height: number };
};
export type TreeReactFlowProps = {
  defs: Def[];
  onNodeClick?: (
    event: React.MouseEvent,
    node: Positioned<PrimerNode<{ def: GlobalName }>>
  ) => void;
  treePadding: number;
  forestLayout: "Horizontal" | "Vertical";
  defParams: DefParams;
  layout: LayoutParams;
} & NodeParams;
export const defaultTreeReactFlowProps: Pick<
  TreeReactFlowProps,
  "treePadding" | "forestLayout" | "defParams" | "layout" | keyof NodeParams
> = {
  level: "Expert",
  forestLayout: "Horizontal",
  treePadding: 100,
  nodeWidth: 80,
  nodeHeight: 35,
  boxPadding: 50,
  defParams: { nameNodeMultipliers: { width: 3, height: 2 } },
  layout: {
    type: WasmLayoutType.Tidy,
    margins: { child: 25, sibling: 18 },
  },
};

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

type PrimerNodeWithNested<N> = PrimerNode<
  N & { nested: Graph<Positioned<PrimerNode<N>>, PrimerEdge>[] }
>;
type PrimerNodeWithNestedAndDef = PrimerNodeWithNested<{ def: GlobalName }>;

const defToTree = async (
  def: Def,
  p: DefParams & {
    layout: LayoutParams;
    nodes: NodeParams;
  }
): Promise<Tree<PrimerNodeWithNestedAndDef, PrimerEdge>> => {
  const defNodeId = "def-" + def.name.baseName;
  const sigEdgeId = "def-sig-" + def.name.baseName;
  const bodyEdgeId = "def-body-" + def.name.baseName;
  const defNameNode: PrimerNode = {
    id: defNodeId,
    data: {
      def: def.name,
      width: p.nodes.nodeWidth * p.nameNodeMultipliers.width,
      height: p.nodes.nodeHeight * p.nameNodeMultipliers.height,
      selected:
        deepEqual(p.nodes.selection?.def, def.name) && !p.nodes.selection?.node,
    },
    type: "primer-def-name",
    zIndex: 0,
  };
  const defEdge = async (
    tree: APITree,
    nodeType: NodeType,
    edgeId: string
  ): Promise<[Tree<PrimerNodeWithNestedAndDef, PrimerEdge>, PrimerEdge]> =>
    augmentTree(tree, (n0) =>
      makePrimerNode(n0, p.nodes, p.layout, 0, nodeType).then(
        ([n, e, nested]) => [
          primerNodeWith(n, {
            def: def.name,
            nested: nested.map((g) =>
              graphMap(g, ({ position, ...n }) => ({
                ...primerNodeWith(n, { def: def.name }),
                position,
              }))
            ),
          }),
          e,
        ]
      )
    ).then((t) => [
      t,
      {
        id: edgeId,
        source: defNodeId,
        target: t.node.id,
        type: "primer-def-name",
        zIndex: 0,
        sourceHandle: Position.Bottom,
        targetHandle: Position.Top,
      },
    ]);
  const sigTree = await defEdge(def.type_, "SigNode", sigEdgeId);
  const bodyTree = await (def.term
    ? defEdge(def.term, "BodyNode", bodyEdgeId)
    : undefined);
  return {
    node: primerNodeWith(defNameNode, { def: def.name, nested: [] }),
    childTrees: [sigTree, ...(bodyTree ? [bodyTree] : [])],
  };
};

/** Renders multiple definitions on one canvas.
 * For each definition, it displays three things:
 * - the definition's name
 * - the definition's type
 * - the definition's body (a term)
 * It ensures that these are clearly displayed as "one atomic thing",
 * i.e. to avoid confused readings that group the type of 'foo' with the body of 'bar' (etc).
 */
export const TreeReactFlow = (p: TreeReactFlowProps) => (
  <Trees
    makeTrees={Promise.all(
      p.defs.map((def) =>
        defToTree(def, {
          ...p.defParams,
          layout: p.layout,
          nodes: p,
        }).then((t) => layoutTree(t, p.layout))
      )
    ).then(
      // Space out the forest.
      (sizedTrees) =>
        sizedTrees.reduce<
          [Tree<Positioned<PrimerNodeWithNestedAndDef>, PrimerEdge>[], number]
        >(
          ([trees, offset], { tree, width, height }) => {
            const { increment, offsetVector } = (() => {
              switch (p.forestLayout) {
                case "Horizontal":
                  return {
                    increment: width,
                    offsetVector: { x: offset, y: 0 },
                  };
                case "Vertical":
                  return {
                    increment: height,
                    offsetVector: { x: 0, y: offset },
                  };
              }
            })();
            return [
              trees.concat(
                treeMap(tree, (n) => ({
                  ...n,
                  position: {
                    x: n.position.x + p.layout.margins.sibling + offsetVector.x,
                    y: n.position.y + p.layout.margins.child + offsetVector.y,
                  },
                }))
              ),
              offset + increment + p.treePadding,
            ];
          },
          [[], 0]
        )[0]
    )}
    {...(p.onNodeClick && { onNodeClick: p.onNodeClick })}
  ></Trees>
);
export default TreeReactFlow;

export type TreeReactFlowOneProps = {
  tree?: APITree;
  onNodeClick?: (event: React.MouseEvent, node: Positioned<PrimerNode>) => void;
  layout: LayoutParams;
} & NodeParams;

/** Renders one `APITree` (e.g. one type or one term) on its own individual canvas.
 * This is essentially a much simpler version of `TreeReactFlow`.
 */
export const TreeReactFlowOne = (p: TreeReactFlowOneProps) => (
  <Trees
    makeTrees={
      p.tree
        ? augmentTree(p.tree, (n0) =>
            makePrimerNode(n0, p, p.layout, 0, "BodyNode").then(
              ([n, e, nested]) => [primerNodeWith(n, { nested }), e]
            )
          )
            .then((t) => layoutTree(t, p.layout))
            .then(({ tree }) => [tree])
        : new Promise(() => [])
    }
    {...(p.onNodeClick && { onNodeClick: p.onNodeClick })}
  ></Trees>
);

// The core of our interaction with ReactFlow: take some abstract trees, and render them.
// This is not exported, but various wrappers around it are.
const Trees = <N,>(p: {
  makeTrees: Promise<Tree<Positioned<PrimerNodeWithNested<N>>, PrimerEdge>[]>;
  onNodeClick?: (
    event: React.MouseEvent,
    node: Positioned<PrimerNode<N>>
  ) => void;
}): JSX.Element => {
  const trees = usePromise([], p.makeTrees);
  const { nodes, edges } = combineGraphs([
    ...trees.map(treeToGraph),
    ...trees.flatMap((tree) => treeNodes(tree).flatMap((n) => n.data.nested)),
  ]);

  // ReactFlow requires a unique id to be passed in if there are
  // multiple flows on one page. We simply get react to generate
  // a unique id for us.
  const id = useId();

  return (
    <ReactFlowSafe<Positioned<PrimerNode<N>>, PrimerEdge>
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
  N extends RFNode<unknown> & { type: string },
  E extends RFEdge<unknown> & { type: string }
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
