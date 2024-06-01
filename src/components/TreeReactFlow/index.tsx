import {
  Def,
  Tree as APITree,
  Selection,
  NodeBody,
  GlobalName,
  NodeType,
  Level,
  TypeDef,
  EdgeFlavor,
} from "@/primer-api";
import type { NodeChange } from "@xyflow/react";
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
  BaseEdge,
  EdgeLabelRenderer,
} from "@xyflow/react";
import "./reactflow.css";
import { MutableRefObject, PropsWithChildren, useId } from "react";
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
  PrimerTypeDefConsNodeProps,
  PrimerTypeDefParamNodeProps,
  PrimerTypeDefNameNodeProps,
  NodeData,
  Padding,
  PrimerAnimationNodeProps,
} from "./Types";
import { LayoutParams, layoutTree } from "./layoutTree";
import {
  NodeFlavor,
  boxFlavorBackground,
  commonHoverClasses,
  flavorClasses,
  flavorContentClasses,
  flavorEdgeClasses,
  flavorIsSyntax,
  flavorLabel,
  flavorLabelClasses,
  flavorSort,
  noBodyFlavorContents,
  sortClasses,
} from "./Flavor";
import { ZoomBar, ZoomBarProps } from "./ZoomBar";
import { WasmLayoutType } from "@hackworthltd/tidyt-wasm";
import { deepEqualTyped, usePromise } from "@/util";
import { mapSnd } from "fp-ts/lib/Tuple";

export type ScrollToDef = (defName: string) => void;

/**
 * Only the `FitViewOptions` from `ReactFlow` that we want to expose.
 */
export type FitViewOptions = {
  padding?: number;
};

/**
 * A subset of the properties that `ReactFlow` supports and that we want to
 * expose to users of `TreeReactFlow` and `TreeReactFlowOne`.
 */
export type OnNodesChange = (nodesChanges: NodeChange[]) => void;
type ReactFlowParams = {
  onNodesChange?: OnNodesChange;

  /**
   * Options that are passed to the initial `fitView` call.
   */
  fitViewOptions?: FitViewOptions;
};

/** These properties are needed to construct nodes, but are invariant across all nodes. */
export type NodeStyle = "corner" | "inline";
type NodeParams = {
  style: NodeStyle;
  nodeWidth: number;
  nodeHeight: number;
  boxPadding: number;
  defNodePadding: Padding;
  selection?: Selection;
  level: Level;
  showIDs: boolean;
  alwaysShowLabels: boolean;
};
type DefParams = {
  nameNodeMultipliers: { width: number; height: number };
};

export type TreeReactFlowProps = {
  defs: Def[];
  typeDefs: TypeDef[];
  onNodeClick: (
    event: React.MouseEvent,
    selection: Selection | undefined
  ) => void;
  treePadding: number;
  forestLayout: "Horizontal" | "Vertical";
  defParams: DefParams;
  layout: LayoutParams;
  scrollToDefRef: MutableRefObject<ScrollToDef | undefined>;
  scrollToTypeDefRef: MutableRefObject<ScrollToDef | undefined>;
  zoomBarProps: ZoomBarProps;
} & NodeParams &
  ReactFlowParams;
export const defaultTreeReactFlowProps: Pick<
  TreeReactFlowProps,
  "treePadding" | "forestLayout" | "defParams" | "layout" | keyof NodeParams
> = {
  style: "corner",
  level: "Expert",
  forestLayout: "Horizontal",
  treePadding: 100,
  nodeWidth: 80,
  nodeHeight: 35,
  boxPadding: 55,
  defParams: { nameNodeMultipliers: { width: 3, height: 2 } },
  defNodePadding: { bottom: 16 },
  layout: {
    type: WasmLayoutType.Tidy,
    margins: { child: 28, sibling: 18 },
  },
  showIDs: false,
  alwaysShowLabels: false,
};
export const inlineTreeReactFlowProps: typeof defaultTreeReactFlowProps = {
  ...defaultTreeReactFlowProps,
  style: "inline",
  boxPadding: 35,
  layout: {
    ...defaultTreeReactFlowProps.layout,
    margins: { child: 19, sibling: 12 },
  },
};

// These should probably take a `GlobalName` instead, but we're not
// quite there yet.
const defNameToNodeId = (name: string) => `def-${name}`;
const typeDefNameToNodeId = (name: string) => `typedef-name-${name}`;

const handle = (type: HandleType, position: Position) => (
  <Handle id={position} isConnectable={false} type={type} position={position} />
);

const nodeTypes = {
  primer: ({
    data,
    id,
  }: {
    data: PrimerNodeProps & PrimerCommonNodeProps;
    id: string;
  }) => {
    return (
      <>
        {handle("target", Position.Top)}
        {handle("target", Position.Left)}
        <div
          title={data.contents}
          style={{
            width: data.width,
            height: data.height,
          }}
          className={classNames(
            "flex justify-center gap-1.5 border-4 text-grey-tertiary",
            data.selected ? "ring-4 ring-offset-4" : "hover:ring-opacity-50",
            flavorClasses(data.flavor)
          )}
        >
          {data.hideLabel ? (
            <></>
          ) : (
            <div
              className={classNames(
                "shrink-0 flex items-center justify-center z-20 text-sm xl:text-base",
                flavorLabelClasses(data.flavor),
                data.style == "corner" &&
                  classNames(
                    "p-1 absolute",
                    data.centerLabel ? "-top-4" : "-left-2 -top-5"
                  ),
                data.style == "inline" && "-m-1 mr-0"
              )}
              style={{ width: data.height }}
            >
              {data.showIDs ? id : flavorLabel(data.flavor)}
            </div>
          )}
          <div
            className={classNames(
              "overflow-hidden grow flex self-center justify-center px-1 font-code text-sm xl:text-base",
              flavorContentClasses(data.flavor),
              // This makes the content look more centered, given the rounded ends (see `sortClasses`).
              data.style == "inline" &&
                flavorSort(data.flavor) == "term" &&
                !data.hideLabel &&
                "relative right-1"
            )}
          >
            <div className="truncate">{data.contents}</div>
          </div>
        </div>
        {handle("source", Position.Bottom)}
        {handle("source", Position.Right)}
      </>
    );
  },
  "primer-simple": ({
    data,
    id,
  }: {
    data: PrimerSimpleNodeProps & PrimerCommonNodeProps;
    id: string;
  }) => (
    <>
      {handle("target", Position.Top)}
      {handle("target", Position.Left)}
      <div
        title={data.flavor}
        className={classNames(
          {
            "ring-4 ring-offset-4": data.selected,
            "hover:ring-opacity-50": !data.selected,
          },
          "flex items-center justify-center border-4 text-grey-tertiary",
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
              "block px-1 font-code text-sm xl:text-base",
              flavorContentClasses(data.flavor)
            )}
          >
            {data.showIDs ? id : flavorLabel(data.flavor)}
          </div>
        }
      </div>
      {handle("source", Position.Bottom)}
      {handle("source", Position.Right)}
    </>
  ),
  "primer-box": ({
    data,
    id,
  }: {
    data: PrimerBoxNodeProps & PrimerCommonNodeProps;
    id: string;
  }) => (
    <>
      {handle("target", Position.Top)}
      {handle("target", Position.Left)}
      <div
        className={classNames(
          "flex justify-center border-4",
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
          {data.showIDs ? id : flavorLabel(data.flavor)}
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
        title={data.def.baseName}
        className={classNames(
          sortClasses("term"),
          "flex items-center justify-center",
          "bg-white-primary",
          "border-4 border-grey-secondary ring-grey-secondary",
          data.selected && "ring-4 ring-offset-4",
          commonHoverClasses,
          "hover:ring-grey-secondary",
          !data.selected && "hover:ring-opacity-50"
        )}
        style={{
          width: data.width,
          height: data.height,
        }}
      >
        <div className="block truncate px-2 font-code text-xl font-semibold text-blue-primary">
          {data.def.baseName}
        </div>
      </div>
      {handle("source", Position.Bottom)}
    </>
  ),
  "primer-typedef-name": ({
    data,
  }: {
    data: PrimerCommonNodeProps & PrimerTypeDefNameNodeProps;
  }) => (
    <>
      <div
        title={data.name.baseName}
        className={classNames(
          sortClasses("type"),
          "flex items-center justify-center",
          "bg-white-primary",
          "border-4 border-grey-secondary ring-grey-secondary",
          data.selected && "ring-4 ring-offset-4",
          commonHoverClasses,
          "hover:ring-grey-secondary",
          !data.selected && "hover:ring-opacity-50"
        )}
        style={{
          width: data.width,
          height: data.height,
        }}
      >
        <div className="block truncate px-2 font-code text-xl font-semibold text-blue-primary">
          {data.name.baseName}
        </div>
      </div>
      {handle("source", Position.Bottom)}
      {handle("source", Position.Right)}
    </>
  ),
  "primer-typedef-param": ({
    data,
  }: {
    data: PrimerCommonNodeProps & PrimerTypeDefParamNodeProps;
  }) => (
    <>
      {handle("target", Position.Left)}
      <div
        title={data.name}
        className={classNames(
          sortClasses("type"),
          "flex items-center justify-center",
          "border-4",
          data.selected && "ring-4 ring-offset-4",
          !data.selected && "hover:ring-opacity-50",
          flavorClasses("TVar")
        )}
        style={{
          width: data.width,
          height: data.height,
        }}
      >
        {
          <div
            className={classNames(
              "block truncate px-2 font-code text-sm text-blue-primary"
            )}
          >
            {data.name}
          </div>
        }
      </div>
      {handle("source", Position.Bottom)}
      {handle("source", Position.Right)}
    </>
  ),
  "primer-typedef-cons": ({
    data,
  }: {
    data: PrimerCommonNodeProps & PrimerTypeDefConsNodeProps;
  }) => (
    <>
      {handle("target", Position.Top)}
      {handle("target", Position.Left)}
      <div
        title={data.name.baseName}
        className={classNames(
          sortClasses("term"),
          "flex items-center justify-center",
          "border-4",
          data.selected && "ring-4 ring-offset-4",
          commonHoverClasses,
          !data.selected && "hover:ring-opacity-50",
          flavorClasses("Con")
        )}
        style={{
          width: data.width,
          height: data.height,
        }}
      >
        <div
          className={classNames(
            "block truncate px-1 font-code text-sm",
            flavorContentClasses("Con")
          )}
        >
          {data.name.baseName}
        </div>
      </div>
      {handle("source", Position.Bottom)}
      {handle("source", Position.Right)}
    </>
  ),
  "primer-animation": ({
    data,
  }: {
    data: PrimerAnimationNodeProps & PrimerCommonNodeProps;
  }) => <img src={"data:img/gif;base64," + data.contents} />,
};

const edgeTypes = {
  primer: ({
    data,
    id,
    // TODO split out common edge props to ensure this is inferred to be a string
    // label,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  }: EdgeProps<PrimerEdge> & { data: PrimerEdgeProps }) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
    const label = (() => {
      switch (data.edgeFlavor) {
        case "Hole":
          return undefined;
        case "AnnTerm":
          return undefined;
        case "Ann":
          return undefined;
        case "AppFun":
          return undefined;
        case "AppArg":
          return undefined;
        case "ConField":
          return undefined;
        case "Lam":
          return undefined;
        case "LetEqual":
          return "=";
        case "LetIn":
          return "in";
        case "MatchInput":
          return undefined;
        case "Pattern":
          return undefined;
        case "MatchOutput":
          return undefined;
        case "FunIn":
          return undefined;
        case "FunOut":
          return undefined;
        case "ForallKind":
          return undefined;
        case "Forall":
          return undefined;
        case "Bind":
          return undefined;
      }
    })();
    return (
      <>
        <BaseEdge
          label={id}
          id={id}
          path={edgePath}
          style={{ strokeWidth: "0.25rem", fill: "none" }}
        ></BaseEdge>
        {label && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                padding: "0.15rem",
                // color: "rgb(100, 176, 200)", // parent
                color: "rgb(52, 55, 93)", // primary blue, as used for most text
                // boxShadow: "0 0 0.2rem 0.2rem white",
              }}
            >
              {label}
            </div>
          </EdgeLabelRenderer>
        )}
      </>
    );
  },
  "primer-def": ({
    id,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    label,
  }: EdgeProps<PrimerEdge>) => {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      offset: 0,
    });
    return (
      <>
        <BaseEdge
          label={id}
          id={id}
          path={edgePath}
          style={{ strokeWidth: "0.25rem", fill: "none", strokeDasharray: 4 }}
        ></BaseEdge>
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      </>
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
  f: (
    tree: APITreeNode
  ) => Promise<[T, (child: T, flavor: EdgeFlavor, isRight: boolean) => E]>
): Promise<Tree<T, E>> => {
  const childTrees = await Promise.all(
    tree.childTrees.map((t) =>
      augmentTree(t.snd, f).then((r) => [r, t.fst] as const)
    )
  );
  const [node, makeEdge] = await f({
    children: tree.childTrees.length + (tree.rightChild ? 1 : 0),
    ...tree,
  });
  const rightChild = await (tree.rightChild
    ? augmentTree(tree.rightChild.snd, f)
    : undefined);
  return {
    ...(rightChild && tree.rightChild
      ? {
          rightChild: [
            rightChild,
            makeEdge(rightChild.node, tree.rightChild.fst, true),
          ],
        }
      : {}),
    childTrees: childTrees.map(([e, flavor]) => [
      e,
      makeEdge(e.node, flavor, false),
    ]),
    node,
  };
};

const makePrimerNode = async (
  node: APITreeNode,
  p: NodeParams,
  layout: LayoutParams,
  zIndex: number,
  nodeData: NodeData,
  def?: GlobalName
): Promise<
  [
    PrimerNode,
    (child: PrimerNode, flavor: EdgeFlavor, isRight: boolean) => PrimerEdge,
    /* Nodes of nested trees, already positioned.
    We have to lay these out first in order to know the dimensions of boxes to be drawn around them.*/
    PrimerGraph[],
  ]
> => {
  const selected =
    p.selection != undefined &&
    deepEqualTyped(
      def && makeSelectionFromNodeData(def, node.nodeId, nodeData),
      p.selection
    );
  const id = node.nodeId;
  const hideLabels = p.level == "Expert" && !p.alwaysShowLabels && !p.showIDs;
  const common = {
    width: p.nodeWidth,
    height: p.nodeHeight,
    selected,
    nodeData,
    style: p.style,
    showIDs: p.showIDs,
  };
  const edgeCommon = (
    flavor: NodeFlavor,
    child: PrimerNode,
    isRight: boolean
  ): Omit<PrimerEdge, "type" | "data"> => ({
    id: JSON.stringify([id, child.id]),
    source: id,
    target: child.id,
    zIndex,
    sourceHandle: isRight ? Position.Right : Position.Bottom,
    targetHandle: isRight ? Position.Left : Position.Top,
    className: flavorEdgeClasses(flavor),
  });
  const width = (hideLabel: boolean) =>
    p.style == "inline" && !hideLabel
      ? common.width + common.height
      : common.width;
  switch (node.body.tag) {
    case "PrimBody": {
      const hideLabel = hideLabels;
      const { fst: flavor, snd: prim } = node.body.contents;
      if (prim.tag == "PrimAnimation") {
        return [
          {
            id,
            type: "primer-animation",
            data: { contents: prim.contents, ...common },
            zIndex,
          },
          (child, edgeFlavor, isRight) => ({
            type: "primer",
            data: { flavor, edgeFlavor },
            ...edgeCommon(flavor, child, isRight),
          }),
          [],
        ];
      }
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
            centerLabel: false,
            hideLabel,
            ...common,
            width: width(hideLabel),
          },
          zIndex,
        },
        (child, edgeFlavor, isRight) => ({
          type: "primer",
          data: { flavor, edgeFlavor },
          ...edgeCommon(flavor, child, isRight),
        }),
        [],
      ];
    }
    case "TextBody": {
      const { fst: flavor, snd: name } = node.body.contents;
      const hideLabel = hideLabels && !flavorIsSyntax(flavor);
      return [
        {
          id,
          type: "primer",
          data: {
            flavor,
            contents: name.baseName,
            centerLabel: false,
            hideLabel,
            ...common,
            width: width(hideLabel),
          },
          zIndex,
        },
        (child, edgeFlavor, isRight) => ({
          type: "primer",
          data: { flavor, edgeFlavor },
          ...edgeCommon(flavor, child, isRight),
        }),
        [],
      ];
    }
    case "NoBody": {
      const flavor = node.body.contents;
      const makeChild = (
        child: PrimerNode,
        edgeFlavor: EdgeFlavor,
        isRight: boolean
      ): PrimerEdge => ({
        type: "primer",
        data: { flavor, edgeFlavor },
        ...edgeCommon(flavor, child, isRight),
      });
      if (p.level == "Beginner") {
        return [
          {
            id,
            type: "primer",
            data: {
              flavor,
              contents: noBodyFlavorContents(node.body.contents),
              centerLabel: node.children >= 2,
              hideLabel: false,
              ...common,
              // TODO This is necessary to ensure that all syntax labels fit.
              // It can be removed when we have dynamic node sizes.
              width: 150,
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
              ...(flavorSort(flavor) == "kind"
                ? {
                    padding: {
                      // Since these nodes are rotated, their width,
                      // as reported to the layout engine, is off by a factor of √2.
                      // We don't pad vertically since allowing some overlap in the y-axis actually looks better,
                      // due to the rotation and the fact that all non-leaf kind nodes have precisely two children.
                      left: (common.height * Math.sqrt(2) - common.height) / 2,
                      right: (common.height * Math.sqrt(2) - common.height) / 2,
                    },
                  }
                : {}),
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
        makePrimerNode(n0, p, layout, zIndex + 1, nodeData, def).then(
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
        (child, edgeFlavor, isRight) => ({
          type: "primer",
          data: { flavor, edgeFlavor },
          ...edgeCommon(flavor, child, isRight),
        }),
        bodyNested.concat({
          nodes: bodyLayout.nodes.map((node) => ({
            ...node,
            parentId: id,
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

const makeSelectionFromNode = (
  node: PrimerNode<{ def: GlobalName }>
): Selection | undefined => {
  if (node.type == "primer-typedef-name") {
    return {
      tag: "SelectionTypeDef",
      contents: { def: node.data.def },
    };
  } else if (node.type == "primer-def-name") {
    return {
      tag: "SelectionDef",
      contents: { def: node.data.def },
    };
  } else if (node.type == "primer-typedef-param") {
    return {
      tag: "SelectionTypeDef",
      contents: {
        def: node.data.def,
        node: {
          tag: "TypeDefParamNodeSelection",
          contents: { param: node.data.name },
        },
      },
    };
  } else if (node.type == "primer-typedef-cons") {
    return {
      tag: "SelectionTypeDef",
      contents: {
        def: node.data.def,
        node: {
          tag: "TypeDefConsNodeSelection",
          contents: { con: node.data.name },
        },
      },
    };
  } else if (node.type == "primer-animation") {
    return {
      tag: "SelectionDef",
      contents: {
        def: node.data.def,
        node: {
          nodeType: "BodyNode",
          // This will always be an actual number, since these nodes have backend IDs.
          meta: Number(node.id),
        },
      },
    };
  } else {
    return makeSelectionFromNodeData(
      node.data.def,
      node.id,
      node.data.nodeData
    );
  }
};

const makeSelectionFromNodeData = (
  def: GlobalName,
  id0: string,
  nodeData: NodeData
): Selection | undefined => {
  const id = Number(id0);
  // Non-numeric IDs correspond to non-selectable nodes (those with no ID in backend) e.g. pattern constructors.
  if (!isNaN(id)) {
    switch (nodeData.tag) {
      case "termDefNode":
        return {
          tag: "SelectionDef",
          contents: {
            def,
            node: { meta: id, nodeType: nodeData.nodeType },
          },
        };
      case "typeDefFieldNode":
        return {
          tag: "SelectionTypeDef",
          contents: {
            def,
            node: {
              tag: "TypeDefConsNodeSelection",
              contents: {
                con: nodeData.con,
                field: {
                  index: nodeData.index,
                  meta: id,
                },
              },
            },
          },
        };
      case "typeDefParamKindNode":
        return {
          tag: "SelectionTypeDef",
          contents: {
            def,
            node: {
              tag: "TypeDefParamNodeSelection",
              contents: {
                param: nodeData.name,
                kindMeta: id,
              },
            },
          },
        };
    }
  } else {
    return undefined;
  }
};

type PrimerNodeWithNested<N> = PrimerNode<
  N & { nested: Graph<Positioned<PrimerNode<N>>, PrimerEdge>[] }
>;
type PrimerNodeWithNestedAndDef = PrimerNodeWithNested<{ def: GlobalName }>;

const defToTree = async (
  def: Def,
  p: DefParams & NodeParams & { layout: LayoutParams }
): Promise<Tree<PrimerNodeWithNestedAndDef, PrimerEdge>> => {
  const defNodeId = defNameToNodeId(def.name.baseName);
  const sigEdgeId = "def-sig-" + def.name.baseName;
  const bodyEdgeId = "def-body-" + def.name.baseName;
  const defNameNode: PrimerNodeWithNestedAndDef = {
    id: defNodeId,
    data: {
      style: p.style,
      def: def.name,
      width: p.nodeWidth * p.nameNodeMultipliers.width,
      height: p.nodeHeight * p.nameNodeMultipliers.height,
      selected: deepEqualTyped(p.selection, {
        tag: "SelectionDef",
        contents: { def: def.name },
      }),
      nested: [],
      padding: p.defNodePadding,
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
      makePrimerNode(
        n0,
        p,
        p.layout,
        0,
        { tag: "termDefNode", nodeType },
        def.name
      ).then(([n, e, nested]) => [
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
      ])
    ).then((t) => [
      t,
      {
        id: edgeId,
        source: defNodeId,
        target: t.node.id,
        type: "primer-def",
        zIndex: 0,
        sourceHandle: Position.Bottom,
        targetHandle: Position.Top,
        className: "stroke-grey-tertiary",
      },
    ]);
  const sigTree = await defEdge(def.type_, "SigNode", sigEdgeId);
  const bodyTree = await (def.term
    ? defEdge(def.term, "BodyNode", bodyEdgeId)
    : undefined);
  return {
    node: defNameNode,
    childTrees: [sigTree, ...(bodyTree ? [bodyTree] : [])],
  };
};

const typeDefToTree = async (
  def: TypeDef,
  p: DefParams & NodeParams & { layout: LayoutParams }
): Promise<Tree<PrimerNode<{ def: GlobalName }>, PrimerEdge>> => {
  type N = PrimerNode<{ def: GlobalName }>;
  type E = PrimerEdge;
  type T = Tree<N, E>;

  const paramKindTrees = await Promise.all(
    def.params.map(({ name, kind }) =>
      augmentTree(kind, (n0) =>
        makePrimerNode(
          n0,
          p,
          p.layout,
          0,
          { tag: "typeDefParamKindNode", name },
          def.name
        ).then(([n, e, nested]) => [
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
        ])
      ).then((kind) => ({ name, kind }))
    )
  );
  const rootId = typeDefNameToNodeId(def.name.baseName);
  const paramsTree = paramKindTrees.reduceRight<
    [T, (parentId: string) => E] | undefined
  >((child, { name, kind }) => {
    const id =
      "typedef-param-" + JSON.stringify({ def: def.name.baseName, name });
    const node: N = {
      id,
      type: "primer-typedef-param",
      data: {
        style: p.style,
        def: def.name,
        width: p.nodeWidth,
        height: p.nodeHeight,
        name,
        selected: deepEqualTyped(p.selection, {
          tag: "SelectionTypeDef",
          contents: {
            def: def.name,
            node: {
              tag: "TypeDefParamNodeSelection",
              contents: { param: name },
            },
          },
        }),
      },
      zIndex: 0,
    };
    const kindEdge: E = {
      id: JSON.stringify([id, kind.node.id]),
      source: id,
      target: kind.node.id,
      sourceHandle: Position.Bottom,
      targetHandle: Position.Top,
      zIndex: 0,
      type: "primer-def",
      className: "stroke-grey-tertiary",
    };
    return [
      {
        node,
        childTrees: [[kind, kindEdge]],
        ...(child
          ? { rightChild: mapSnd((f: (parentId: string) => E) => f(id))(child) }
          : {}),
      },
      (parentId) => ({
        id: JSON.stringify([parentId, id]),
        source: parentId,
        target: id,
        type: "primer-def",
        zIndex: 0,
        sourceHandle: Position.Right,
        targetHandle: Position.Left,
        className: "stroke-grey-tertiary",
      }),
    ];
  }, undefined);
  const constructorTrees: [T, E][] = await Promise.all(
    (def.constructors ?? []).map(async (cons) => {
      const consId = "typedef-cons-" + cons.name.baseName;
      const fieldTrees = await Promise.all(
        cons.fields.map<Promise<[T, E]>>((t, index) =>
          augmentTree(t, (n0) =>
            makePrimerNode(
              n0,
              p,
              p.layout,
              0,
              { tag: "typeDefFieldNode", con: cons.name, index },
              def.name
            ).then(([n, e, nested]) => [
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
            ])
          ).then((t) => [
            t,
            {
              id: JSON.stringify([consId, t.node.id]),
              source: consId,
              target: t.node.id,
              type: "primer-def",
              zIndex: 0,
              sourceHandle: Position.Bottom,
              targetHandle: Position.Top,
              className: "stroke-grey-tertiary",
            },
          ])
        )
      );
      return [
        {
          node: {
            id: consId,
            type: "primer-typedef-cons",
            data: {
              style: p.style,
              def: def.name,
              name: cons.name,
              width: p.nodeWidth,
              height: p.nodeHeight,
              selected: deepEqualTyped(p.selection, {
                tag: "SelectionTypeDef",
                contents: {
                  def: def.name,
                  node: {
                    tag: "TypeDefConsNodeSelection",
                    contents: { con: cons.name },
                  },
                },
              }),
              padding: p.defNodePadding,
            },
            zIndex: 0,
          },
          childTrees: fieldTrees,
        },
        {
          id: JSON.stringify([rootId, consId]),
          type: "primer-def",
          source: rootId,
          target: consId,
          sourceHandle: Position.Bottom,
          targetHandle: Position.Top,
          zIndex: 0,
          className: "stroke-grey-tertiary",
        },
      ];
    })
  );
  return {
    node: {
      id: rootId,
      type: "primer-typedef-name",
      data: {
        style: p.style,
        def: def.name,
        name: def.name,
        height: p.nodeHeight * p.nameNodeMultipliers.height,
        width: p.nodeWidth * p.nameNodeMultipliers.width,
        selected: deepEqualTyped(p.selection, {
          tag: "SelectionTypeDef",
          contents: { def: def.name },
        }),
        padding: p.defNodePadding,
      },
      zIndex: 0,
    },
    childTrees: constructorTrees,
    ...(paramsTree
      ? {
          rightChild: mapSnd((f: (parentId: string) => E) => f(rootId))(
            paramsTree
          ),
        }
      : {}),
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
export const TreeReactFlow = (p: PropsWithChildren<TreeReactFlowProps>) => {
  const spaceForest = (
    sizedTrees: {
      tree: Tree<Positioned<PrimerNodeWithNestedAndDef>, PrimerEdge>;
      width: number;
      height: number;
    }[]
  ) =>
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
    )[0];
  return (
    <Trees
      {...p}
      makeTrees={(async () => {
        const typeDefTrees = await Promise.all(
          p.typeDefs.map((def) =>
            typeDefToTree(def, { ...p.defParams, ...p }).then((t) =>
              layoutTree(t, p.layout).then(({ tree, width, height }) => ({
                // All we're doing here is adding `nested: []` to all type def nodes.
                // We just have to be very explicit here in order to please the typechecker.
                width,
                height,
                tree: treeMap(tree, ({ position, ...n }) => ({
                  position,
                  ...primerNodeWith(n, { nested: [], ...n.data }),
                })),
              }))
            )
          )
        );
        const termDefTrees = await Promise.all(
          p.defs.map((def) =>
            defToTree(def, { ...p.defParams, ...p }).then((t) =>
              layoutTree(t, p.layout)
            )
          )
        );
        const typeRowHeight =
          typeDefTrees.length > 0
            ? Math.max(...typeDefTrees.map((x) => x.height)) + p.treePadding
            : 0;
        return [
          ...spaceForest(typeDefTrees),
          ...spaceForest(termDefTrees).map((t) =>
            treeMap(t, ({ position, ...n }) => ({
              position: { x: position.x, y: position.y + typeRowHeight },
              ...n,
            }))
          ),
        ];
      })()}
      onNodeClick={(mouseEvent, node) =>
        p.onNodeClick(mouseEvent, makeSelectionFromNode(node))
      }
      zoomBarProps={p.zoomBarProps}
    >
      <SetTreeReactFlowCallbacks
        scrollToDefRef={p.scrollToDefRef}
        scrollToTypeDefRef={p.scrollToTypeDefRef}
      />
      {p.children}
    </Trees>
  );
};
export default TreeReactFlow;

export type TreeReactFlowOneProps = {
  tree?: APITree;
  onNodeClick?: (event: React.MouseEvent, node: Positioned<PrimerNode>) => void;
  layout: LayoutParams;
  zoomBarProps: ZoomBarProps;
} & NodeParams &
  ReactFlowParams;

/** Renders one `APITree` (e.g. one type or one term) on its own individual canvas.
 * This is essentially a much simpler version of `TreeReactFlow`.
 */
export const TreeReactFlowOne = (
  p: PropsWithChildren<TreeReactFlowOneProps>
) => (
  <Trees
    {...p}
    makeTrees={
      p.tree
        ? augmentTree(p.tree, (n0) =>
            makePrimerNode(n0, p, p.layout, 0, {
              tag: "termDefNode",
              nodeType: "BodyNode",
            }).then(([n, e, nested]) => [primerNodeWith(n, { nested }), e])
          )
            .then((t) => layoutTree(t, p.layout))
            .then(({ tree }) => [tree])
        : new Promise(() => [])
    }
    {...(p.onNodeClick && { onNodeClick: p.onNodeClick })}
    zoomBarProps={p.zoomBarProps}
  >
    {p.children}
  </Trees>
);

// The core of our interaction with ReactFlow: take some abstract trees, and render them.
// This is not exported, but various wrappers around it are.
const Trees = <N,>(
  p: PropsWithChildren<{
    makeTrees: Promise<Tree<Positioned<PrimerNodeWithNested<N>>, PrimerEdge>[]>;
    onNodeClick?: (
      event: React.MouseEvent,
      node: Positioned<PrimerNode<N>>
    ) => void;
    zoomBarProps: ZoomBarProps;
  }> &
    ReactFlowParams
): JSX.Element => {
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
      onNodesChange={p.onNodesChange}
      fitViewOptions={p.fitViewOptions}
    >
      <Background gap={25} size={1.6} color="#81818a" />
      <ZoomBar {...p.zoomBarProps} />
      {p.children}
    </ReactFlowSafe>
  );
};

// This component is rendered purely for side effects. We do this
// rather than wrap our `ReactFlow` components with
// `ReactFlowProvider`s.
const SetTreeReactFlowCallbacks = ({
  scrollToDefRef,
  scrollToTypeDefRef,
}: {
  scrollToDefRef: MutableRefObject<ScrollToDef | undefined>;
  scrollToTypeDefRef: MutableRefObject<ScrollToDef | undefined>;
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

  const scrollToTypeDef: ScrollToDef = (defName: string) => {
    // Don't change the current zoom level when scrolling to a
    // definition.
    const zoomLevel: number = getZoom();
    fitView({
      nodes: [{ id: typeDefNameToNodeId(defName) }],
      minZoom: zoomLevel,
      maxZoom: zoomLevel,
    });
  };
  scrollToTypeDefRef.current = scrollToTypeDef;

  return <></>;
};

/** A more strongly-typed version of the `ReactFlow` component.
 * This allows us to use a more refined node type,
 * check that we register its subtypes correctly with ReactFlow,
 * and safely act on that type in handlers. */
export const ReactFlowSafe = <
  N extends RFNode & { type: string },
  E extends RFEdge & { type: string },
>(
  p: Omit<Parameters<typeof ReactFlow>[0], "onNodeClick" | "edgeTypes"> & {
    nodes: N[];
    nodeTypes: {
      [T in N["type"]]: (args: NodeProps & N & { type: T }) => JSX.Element;
    };
    edgeTypes: {
      [T in E["type"]]: (
        args: EdgeProps<PrimerEdge> & E & { type: T }
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
          p.onNodeClick &&
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
