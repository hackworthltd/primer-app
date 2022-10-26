import { Def, GlobalName, NodeFlavor, NodeType, Tree } from "@/Types";
import ReactFlow, {
  Edge,
  Node,
  Handle,
  Position,
  NodeProps,
  Background,
} from "react-flow-renderer/nocss";
import "react-flow-renderer/dist/style.css";
import { layoutGraph, NodeNoPos } from "./layoutGraph";
import { useMemo } from "react";
import classNames from "classnames";

type NodeParams = {
  nodeWidth: number;
  nodeHeight: number;
  boxPadding: number;
  selection?: string;
};
export type TreeReactFlowProps = {
  defs: Def[];
  onNodeClick: (event: React.MouseEvent, node: Node<PrimerNodeProps>) => void;
} & NodeParams;

const flavorClasses = (flavor: NodeFlavor): string => {
  const commonHoverClasses =
    " hover:outline hover:outline-4 hover:outline-offset-4 hover:outline-green-primary";

  switch (flavor) {
    case "FlavorHole":
      return "border-red-tertiary outline-red-tertiary".concat(
        commonHoverClasses
      );
    case "FlavorEmptyHole":
      return "border-red-tertiary outline-red-tertiary".concat(
        commonHoverClasses
      );
    case "FlavorAnn":
      return "border-black-primary outline-black-primary".concat(
        commonHoverClasses
      );
    case "FlavorApp":
      return "border-blue-tertiary outline-blue-tertiary".concat(
        commonHoverClasses
      );
    case "FlavorAPP":
      return "border-yellow-secondary outline-yellow-secondary".concat(
        commonHoverClasses
      );
    case "FlavorCon":
      return "border-green-primary outline-green-primary".concat(
        commonHoverClasses
      );
    case "FlavorLam":
      return "border-blue-primary outline-blue-primary".concat(
        commonHoverClasses
      );
    case "FlavorLAM":
      return "border-black-primary outline-black-primary".concat(
        commonHoverClasses
      );
    case "FlavorGlobalVar":
      return "border-blue-quaternary outline-blue-quaternary".concat(
        commonHoverClasses
      );
    case "FlavorLocalVar":
      return "border-blue-quaternary outline-blue-quaternary".concat(
        commonHoverClasses
      );
    case "FlavorLet":
      return "border-blue-quaternary outline-blue-quaternary".concat(
        commonHoverClasses
      );
    case "FlavorLetType":
      return "border-blue-quaternary outline-blue-quaternary".concat(
        commonHoverClasses
      );
    case "FlavorLetrec":
      return "border-blue-quaternary outline-blue-quaternary".concat(
        commonHoverClasses
      );
    case "FlavorCase":
      return "border-yellow-primary outline-yellow-primary".concat(
        commonHoverClasses
      );

    // Note: not selectable.
    case "FlavorCaseWith":
      return "border-yellow-primary outline-yellow-primary";

    case "FlavorPrimCon":
      return "border-black-primary outline-black-primary".concat(
        commonHoverClasses
      );
    case "FlavorTEmptyHole":
      return "border-black-primary outline-black-primary".concat(
        commonHoverClasses
      );
    case "FlavorTHole":
      return "border-black-primary outline-black-primary".concat(
        commonHoverClasses
      );
    case "FlavorTCon":
      return "border-black-primary outline-black-primary".concat(
        commonHoverClasses
      );
    case "FlavorTFun":
      return "border-black-primary outline-black-primary".concat(
        commonHoverClasses
      );
    case "FlavorTVar":
      return "border-black-primary outline-black-primary".concat(
        commonHoverClasses
      );
    case "FlavorTApp":
      return "border-black-primary outline-black-primary".concat(
        commonHoverClasses
      );
    case "FlavorTForall":
      return "border-black-primary outline-black-primary".concat(
        commonHoverClasses
      );
    case "FlavorTLet":
      return "border-black-primary outline-black-primary".concat(
        commonHoverClasses
      );

    // Note: most parts of patterns aren't selectable.
    case "FlavorPattern":
      return "border-yellow-primary outline-yellow-primary";
    case "FlavorPatternCon":
      return "border-black-primary outline-black-primary";
    case "FlavorPatternBind":
      return "border-black-primary outline-black-primary".concat(
        commonHoverClasses
      );
    case "FlavorPatternApp":
      return "border-black-primary outline-black-primary";
  }
};

const flavorContentClasses = (flavor: NodeFlavor): string => {
  switch (flavor) {
    // For the moment, the text color is independent of the flavor.
    default:
      return "text-blue-primary";
  }
};

const flavorLabelClasses = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "FlavorHole":
      return "border-red-tertiary text-blue-primary";
    case "FlavorEmptyHole":
      return "border-red-tertiary text-blue-primary";
    case "FlavorAnn":
      return "border-black-primary text-blue-primary";
    case "FlavorApp":
      return "border-blue-tertiary text-blue-primary";
    case "FlavorAPP":
      return "border-yellow-secondary text-blue-primary";
    case "FlavorCon":
      return "border-green-primary text-blue-primary";
    case "FlavorLam":
      return "border-blue-primary text-blue-primary";
    case "FlavorLAM":
      return "border-black-primary text-blue-primary";
    case "FlavorGlobalVar":
      return "border-blue-quaternary text-blue-primary";
    case "FlavorLocalVar":
      return "border-blue-quaternary text-blue-primary";
    case "FlavorLet":
      return "border-blue-quaternary text-blue-primary";
    case "FlavorLetType":
      return "border-blue-quaternary text-blue-primary";
    case "FlavorLetrec":
      return "border-blue-quaternary text-blue-primary";
    case "FlavorCase":
      return "border-yellow-primary text-blue-primary";
    case "FlavorCaseWith":
      return "border-yellow-primary text-blue-primary";
    case "FlavorPrimCon":
      return "border-black-primary text-blue-primary";
    case "FlavorTEmptyHole":
      return "border-black-primary text-blue-primary";
    case "FlavorTHole":
      return "border-black-primary text-blue-primary";
    case "FlavorTCon":
      return "border-black-primary text-blue-primary";
    case "FlavorTFun":
      return "border-black-primary text-blue-primary";
    case "FlavorTVar":
      return "border-black-primary text-blue-primary";
    case "FlavorTApp":
      return "border-black-primary text-blue-primary";
    case "FlavorTForall":
      return "border-black-primary text-blue-primary";
    case "FlavorTLet":
      return "border-black-primary text-blue-primary";
    case "FlavorPattern":
      return "border-yellow-primary text-blue-primary";
    case "FlavorPatternCon":
      return "border-black-primary text-blue-primary";
    case "FlavorPatternBind":
      return "border-black-primary text-blue-primary";
    case "FlavorPatternApp":
      return "border-black-primary text-blue-primary";
  }
};

const flavorEdgeClasses = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "FlavorHole":
      return "stroke-red-tertiary stroke-[0.25rem]";
    case "FlavorEmptyHole":
      return "stroke-red-tertiary stroke-[0.25rem]";
    case "FlavorAnn":
      return "stroke-black-primary stroke-[0.25rem]";
    case "FlavorApp":
      return "stroke-blue-tertiary stroke-[0.25rem]";
    case "FlavorAPP":
      return "stroke-yellow-secondary stroke-[0.25rem]";
    case "FlavorCon":
      return "stroke-green-primary stroke-[0.25rem]";
    case "FlavorLam":
      return "stroke-blue-primary stroke-[0.25rem]";
    case "FlavorLAM":
      return "stroke-black-primary stroke-[0.25rem]";
    case "FlavorGlobalVar":
      return "stroke-blue-quaternary stroke-[0.25rem]";
    case "FlavorLocalVar":
      return "stroke-blue-quaternary stroke-[0.25rem]";
    case "FlavorLet":
      return "stroke-blue-quaternary stroke-[0.25rem]";
    case "FlavorLetType":
      return "stroke-blue-quaternary stroke-[0.25rem]";
    case "FlavorLetrec":
      return "stroke-blue-quaternary stroke-[0.25rem]";
    case "FlavorCase":
      return "stroke-yellow-primary stroke-[0.25rem]";
    case "FlavorCaseWith":
      return "stroke-yellow-primary stroke-[0.25rem]";
    case "FlavorPrimCon":
      return "stroke-black-primary stroke-[0.25rem]";
    case "FlavorTEmptyHole":
      return "stroke-black-primary stroke-[0.25rem]";
    case "FlavorTHole":
      return "stroke-black-primary stroke-[0.25rem]";
    case "FlavorTCon":
      return "stroke-black-primary stroke-[0.25rem]";
    case "FlavorTFun":
      return "stroke-black-primary stroke-[0.25rem]";
    case "FlavorTVar":
      return "stroke-black-primary stroke-[0.25rem]";
    case "FlavorTApp":
      return "stroke-black-primary stroke-[0.25rem]";
    case "FlavorTForall":
      return "stroke-black-primary stroke-[0.25rem]";
    case "FlavorTLet":
      return "stroke-black-primary stroke-[0.25rem]";
    case "FlavorPattern":
      return "stroke-yellow-primary stroke-[0.25rem]";
    case "FlavorPatternCon":
      return "stroke-black-primary stroke-[0.25rem]";
    case "FlavorPatternBind":
      return "stroke-black-primary stroke-[0.25rem]";
    case "FlavorPatternApp":
      return "stroke-black-primary stroke-[0.25rem]";
  }
};

const primerNodeClasses = (selected: boolean, flavor: NodeFlavor) =>
  classNames(
    {
      "outline outline-4 outline-offset-4": selected,
      "flex items-center justify-center rounded border-4 text-grey-tertiary bg-white-primary":
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
      "absolute right-0 top-0 rounded border-4 text-sm xl:text-base": true,
    },

    // See note above for `primerNodeClasses`.
    flavorLabelClasses(flavor)
  );

function flavorLabel(flavor: NodeFlavor): string {
  switch (flavor) {
    case "FlavorHole":
      return "{?}";
    case "FlavorEmptyHole":
      return "?";
    case "FlavorAnn":
      return "Ann";
    case "FlavorApp":
      return "$";
    case "FlavorAPP":
      return "@";
    case "FlavorCon":
      return "V";
    case "FlavorLam":
      return "λ";
    case "FlavorLAM":
      return "Λ";
    case "FlavorGlobalVar":
      return "Var";
    case "FlavorLocalVar":
      return "Var";
    case "FlavorLet":
      return "let";
    case "FlavorLetType":
      return "let type";
    case "FlavorLetrec":
      return "let rec";
    case "FlavorCase":
      return "match";
    case "FlavorCaseWith":
      return "with";
    case "FlavorPrimCon":
      return "V";
    case "FlavorTEmptyHole":
      return "?";
    case "FlavorTHole":
      return "{?}";
    case "FlavorTCon":
      return "T";
    case "FlavorTFun":
      return "→";
    case "FlavorTVar":
      return "Var";
    case "FlavorTApp":
      return "@";
    case "FlavorTForall":
      return "∀";
    case "FlavorTLet":
      return "let";
    case "FlavorPattern":
      return "P";
    case "FlavorPatternCon":
      return "V";
    case "FlavorPatternBind":
      return "Var";
    case "FlavorPatternApp":
      return "$";
  }
}

const primerNodeTypeName = "primer";

type PrimerNodePropsNode = {
  label?: string;
  contents?: string;
  width: number;
  height: number;
  flavor: NodeFlavor;
  selected: boolean;
};

type PrimerNodePropsTree = {
  // Invariant: these will be the same for all nodes in a single tree.
  def: GlobalName;
  nodeType: NodeType;
};

type PrimerNodeProps = PrimerNodePropsTree & PrimerNodePropsNode;

const PrimerNode = (p: NodeProps<PrimerNodeProps>) => {
  // these properties are necessary due to an upstream bug: https://github.com/wbkd/react-flow/issues/2193
  const handleStyle = "absolute border-[2px] border-solid border-grey-tertiary";

  return (
    <>
      <Handle type="target" position={Position.Top} className={handleStyle} />
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
      <Handle
        type="source"
        position={Position.Bottom}
        className={handleStyle}
      />
    </>
  );
};

const nodeTypes = { [primerNodeTypeName]: PrimerNode };

const convertTree = (
  tree: Tree,
  def: GlobalName,
  nodeType: NodeType,
  p: NodeParams
): {
  nodes: NodeNoPos<PrimerNodeProps>[];
  edges: Edge<never>[];
  /* Nodes of nested trees, already positioned.
  We have to lay these out first in order to know the dimensions of boxes to be drawn around them.*/
  nested: Node<PrimerNodeProps>[];
} => {
  const childTrees = tree.childTrees.concat(
    tree.rightChild ? [tree.rightChild] : []
  );
  const children = childTrees.map((t) => convertTree(t, def, nodeType, p));
  const id = tree.nodeId;
  const thisNode = (
    data: Omit<PrimerNodePropsNode, "selected">
  ): NodeNoPos<PrimerNodeProps> => {
    return {
      id,
      type: primerNodeTypeName,
      data: {
        def,
        nodeType,
        selected: p.selection == tree.nodeId,
        ...data,
      },
    };
  };
  const thisToChildren: Edge<never>[] = childTrees.map((t) => {
    const target = t.nodeId;
    return {
      id: JSON.stringify([id, target]),
      source: id,
      target,
      className: flavorEdgeClasses(tree.flavor),
      // We draw edges above nodes, so that they aren't hidden by nodes' solid backgrounds.
      zIndex: 1,
    };
  });
  const childNodes = children.flatMap(({ nodes }) => nodes);
  const childEdges = children.flatMap(({ edges }) => edges);
  const childNested = children.flatMap(({ nested }) => nested);
  const edges = childEdges.concat(thisToChildren);

  switch (tree.body.tag) {
    case "TextBody":
      return {
        nodes: [
          thisNode({
            label: flavorLabel(tree.flavor),
            contents: tree.body.contents,
            width: p.nodeWidth,
            height: p.nodeHeight,
            flavor: tree.flavor,
          }),
          ...childNodes,
        ],
        edges,
        nested: childNested,
      };
    case "NoBody":
      return {
        nodes: [
          thisNode({
            contents: flavorLabel(tree.flavor),
            width: p.nodeWidth / 2,
            height: p.nodeHeight / 2,
            flavor: tree.flavor,
          }),
          ...childNodes,
        ],
        edges,
        nested: childNested,
      };
    case "BoxBody": {
      const bodyTree = convertTree(tree.body.contents, def, nodeType, p);
      const bodyLayout0 = layoutGraph(
        bodyTree.nodes.map((node) => {
          return {
            ...node,
            parentNode: id,
          };
        }),
        bodyTree.edges
      );
      const bodyLayout = {
        ...bodyLayout0,
        nodes: bodyLayout0.nodes.map((node) => {
          return {
            ...node,
            position: {
              x: node.position.x + p.boxPadding / 2,
              y: node.position.y + p.boxPadding / 2,
            },
          };
        }),
      };
      return {
        nodes: [
          thisNode({
            label: flavorLabel(tree.flavor),
            width: bodyLayout.width + p.boxPadding,
            height: bodyLayout.height + p.boxPadding,
            flavor: tree.flavor,
          }),
          ...childNodes,
        ],
        edges: edges.concat(bodyTree.edges),
        nested: childNested.concat(bodyLayout.nodes),
      };
    }
  }
};

export const TreeReactFlow = (p: TreeReactFlowProps) => {
  const { nodes, edges } = useMemo(() => {
    const trees = p.defs.flatMap((t) =>
      t.term ? convertTree(t.term, t.name, "BodyNode", p) : []
    );
    const edges = trees.flatMap(({ edges }) => edges);
    const nodes = trees.flatMap(({ nodes }) => nodes);
    const nested = trees.flatMap(({ nested }) => nested);
    return {
      nodes: layoutGraph(nodes, edges).nodes.concat(nested),
      edges,
    };
  }, [p]);

  return (
    <ReactFlow
      onNodeClick={p.onNodeClick}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true, account: "paid-pro" }}
    >
      <Background gap={25} size={0.8} />
    </ReactFlow>
  );
};

export default TreeReactFlow;
