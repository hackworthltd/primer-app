import {
  Def,
  GlobalName,
  NodeFlavor,
  NodeType,
  Tree,
  Selection,
} from "@/primer-api";
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
  selection?: Selection;
};
export type TreeReactFlowProps = {
  defs: Def[];
  onNodeClick: (event: React.MouseEvent, node: Node<PrimerNodeProps>) => void;
} & NodeParams;

const flavorClasses = (flavor: NodeFlavor): string => {
  const commonHoverClasses =
    " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-green-primary";

  switch (flavor) {
    case "FlavorHole":
      return "border-red-tertiary ring-red-tertiary bg-white-primary".concat(
        commonHoverClasses
      );
    case "FlavorEmptyHole":
      return "border-red-tertiary ring-red-tertiary bg-white-primary".concat(
        commonHoverClasses
      );
    case "FlavorAnn":
      return "border-black-primary ring-black-primary bg-black-primary".concat(
        commonHoverClasses
      );
    case "FlavorApp":
      return "border-blue-tertiary ring-blue-tertiary bg-blue-tertiary".concat(
        commonHoverClasses
      );
    case "FlavorAPP":
      return "border-yellow-secondary ring-yellow-secondary bg-yellow-secondary".concat(
        commonHoverClasses
      );
    case "FlavorCon":
      return "border-green-primary ring-green-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "FlavorLam":
      return "border-blue-primary ring-blue-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "FlavorLAM":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "FlavorGlobalVar":
      return "border-blue-quaternary ring-blue-quaternary bg-white-primary".concat(
        commonHoverClasses
      );
    case "FlavorLocalVar":
      return "border-blue-quaternary ring-blue-quaternary bg-white-primary".concat(
        commonHoverClasses
      );
    case "FlavorLet":
      return "border-blue-quaternary ring-blue-quaternary bg-blue-quaternary".concat(
        commonHoverClasses
      );
    case "FlavorLetType":
      return "border-blue-quaternary ring-blue-quaternary bg-blue-quaternary".concat(
        commonHoverClasses
      );
    case "FlavorLetrec":
      return "border-blue-quaternary ring-blue-quaternary bg-blue-quaternary".concat(
        commonHoverClasses
      );
    case "FlavorCase":
      return "border-yellow-primary ring-yellow-primary bg-yellow-primary".concat(
        commonHoverClasses
      );

    // Note: not selectable.
    case "FlavorCaseWith":
      return "border-yellow-primary ring-yellow-primary bg-yellow-primary";

    case "FlavorPrimCon":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "FlavorTEmptyHole":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "FlavorTHole":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "FlavorTCon":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "FlavorTFun":
      return "border-black-primary ring-black-primary bg-black-primary".concat(
        commonHoverClasses
      );
    case "FlavorTVar":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "FlavorTApp":
      return "border-black-primary ring-black-primary bg-black-primary".concat(
        commonHoverClasses
      );
    case "FlavorTForall":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        commonHoverClasses
      );
    case "FlavorTLet":
      return "border-black-primary ring-black-primary bg-black-primary".concat(
        commonHoverClasses
      );

    // Note: most parts of patterns aren't selectable.

    // This node's background is transparent, so that we can draw
    // edges over it. Otherwise, we'd need to special-case the
    // z-index of edges when drawn inside a pattern.
    case "FlavorPattern":
      return "border-yellow-primary ring-yellow-primary";

    case "FlavorPatternCon":
      return "border-green-primary ring-green-primary bg-white-primary";
    case "FlavorPatternBind":
      return "border-blue-quaternary ring-blue-quaternary bg-white-primary".concat(
        commonHoverClasses
      );
    case "FlavorPatternApp":
      return "border-blue-tertiary ring-blue-tertiary bg-blue-tertiary";
  }
};

const flavorContentClasses = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "FlavorHole":
      return "text-blue-primary";
    case "FlavorEmptyHole":
      return "text-blue-primary";
    case "FlavorAnn":
      return "text-white-primary";
    case "FlavorApp":
      return "text-white-primary";
    case "FlavorAPP":
      return "text-white-primary";
    case "FlavorCon":
      return "text-blue-primary";
    case "FlavorLam":
      return "text-blue-primary";
    case "FlavorLAM":
      return "text-blue-primary";
    case "FlavorGlobalVar":
      return "text-blue-primary";
    case "FlavorLocalVar":
      return "text-blue-primary";
    case "FlavorLet":
      return "text-white-primary";
    case "FlavorLetType":
      return "text-white-primary";
    case "FlavorLetrec":
      return "text-white-primary";
    case "FlavorCase":
      return "text-white-primary";
    case "FlavorCaseWith":
      return "text-white-primary";
    case "FlavorPrimCon":
      return "text-blue-primary";
    case "FlavorTEmptyHole":
      return "text-blue-primary";
    case "FlavorTHole":
      return "text-blue-primary";
    case "FlavorTCon":
      return "text-blue-primary";
    case "FlavorTFun":
      return "text-white-primary";
    case "FlavorTVar":
      return "text-blue-primary";
    case "FlavorTApp":
      return "text-white-primary";
    case "FlavorTForall":
      return "text-blue-primary";
    case "FlavorTLet":
      return "text-white-primary";

    // Note: has no text content, so this is somewhat meaningless.
    case "FlavorPattern":
      return "text-blue-primary";

    case "FlavorPatternCon":
      return "text-blue-primary";
    case "FlavorPatternBind":
      return "text-blue-primary";
    case "FlavorPatternApp":
      return "text-white-primary";
  }
};

const flavorLabelClasses = (flavor: NodeFlavor): string => {
  const syntaxClasses = " -top-4";
  const exprClasses = " -right-2 -top-4";

  switch (flavor) {
    case "FlavorHole":
      return "font-code bg-red-tertiary border-red-tertiary text-white-primary".concat(
        exprClasses
      );
    case "FlavorEmptyHole":
      return "font-code bg-red-tertiary border-red-tertiary text-white-primary".concat(
        exprClasses
      );
    case "FlavorAnn":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        syntaxClasses
      );
    case "FlavorApp":
      return "font-code bg-blue-tertiary border-blue-tertiary text-white-primary".concat(
        syntaxClasses
      );
    case "FlavorAPP":
      return "font-code bg-yellow-secondary border-yellow-secondary text-white-primary".concat(
        syntaxClasses
      );
    case "FlavorCon":
      return "bg-green-primary border-green-primary text-white-primary".concat(
        exprClasses
      );
    case "FlavorLam":
      return "font-code bg-blue-primary border-blue-primary text-white-primary".concat(
        exprClasses
      );
    case "FlavorLAM":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        exprClasses
      );
    case "FlavorGlobalVar":
      return "bg-blue-quaternary border-blue-quaternary text-white-primary".concat(
        exprClasses
      );
    case "FlavorLocalVar":
      return "bg-blue-quaternary border-blue-quaternary text-white-primary".concat(
        exprClasses
      );
    case "FlavorLet":
      return "font-code bg-blue-quaternary border-blue-quaternary text-white-primary".concat(
        syntaxClasses
      );
    case "FlavorLetType":
      return "font-code bg-blue-quaternary border-blue-quaternary text-white-primary".concat(
        syntaxClasses
      );
    case "FlavorLetrec":
      return "font-code bg-blue-quaternary border-blue-quaternary text-white-primary".concat(
        syntaxClasses
      );
    case "FlavorCase":
      return "font-code bg-yellow-primary border-yellow-primary text-white-primary".concat(
        syntaxClasses
      );

    // Special case: we hide this label.
    case "FlavorCaseWith":
      return "hidden font-code bg-yellow-primary border-yellow-primary text-white-primary".concat(
        syntaxClasses
      );

    case "FlavorPrimCon":
      return "bg-black-primary border-black-primary text-white-primary".concat(
        exprClasses
      );
    case "FlavorTEmptyHole":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        exprClasses
      );
    case "FlavorTHole":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        exprClasses
      );
    case "FlavorTCon":
      return "bg-black-primary border-black-primary text-white-primary".concat(
        exprClasses
      );
    case "FlavorTFun":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        syntaxClasses
      );
    case "FlavorTVar":
      return "bg-black-primary border-black-primary text-white-primary".concat(
        exprClasses
      );
    case "FlavorTApp":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        syntaxClasses
      );
    case "FlavorTForall":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        exprClasses
      );
    case "FlavorTLet":
      return "font-code bg-black-primary border-black-primary text-white-primary".concat(
        syntaxClasses
      );
    case "FlavorPattern":
      return "bg-yellow-primary border-yellow-primary text-white-primary".concat(
        syntaxClasses
      );
    case "FlavorPatternCon":
      return "bg-green-primary border-green-primary text-white-primary".concat(
        exprClasses
      );
    case "FlavorPatternBind":
      return "bg-blue-quaternary border-blue-quaternary text-white-primary".concat(
        exprClasses
      );
    case "FlavorPatternApp":
      return "font-code bg-blue-tertiary border-blue-tertiary text-white-primary".concat(
        syntaxClasses
      );
  }
};

const flavorEdgeClasses = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "FlavorHole":
      return "stroke-red-tertiary stroke-[0.25rem] z-10";
    case "FlavorEmptyHole":
      return "stroke-red-tertiary stroke-[0.25rem] z-10";
    case "FlavorAnn":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "FlavorApp":
      return "stroke-blue-tertiary stroke-[0.25rem] z-10";
    case "FlavorAPP":
      return "stroke-yellow-secondary stroke-[0.25rem] z-10";
    case "FlavorCon":
      return "stroke-green-primary stroke-[0.25rem] z-10";
    case "FlavorLam":
      return "stroke-blue-primary stroke-[0.25rem] z-10";
    case "FlavorLAM":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "FlavorGlobalVar":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "FlavorLocalVar":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "FlavorLet":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "FlavorLetType":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "FlavorLetrec":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "FlavorCase":
      return "stroke-yellow-primary stroke-[0.25rem] z-10";
    case "FlavorCaseWith":
      return "stroke-yellow-primary stroke-[0.25rem] z-10";
    case "FlavorPrimCon":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "FlavorTEmptyHole":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "FlavorTHole":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "FlavorTCon":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "FlavorTFun":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "FlavorTVar":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "FlavorTApp":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "FlavorTForall":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "FlavorTLet":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "FlavorPattern":
      return "stroke-yellow-primary stroke-[0.25rem] z-10";
    case "FlavorPatternCon":
      return "stroke-green-primary stroke-[0.25rem] z-10";
    case "FlavorPatternBind":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "FlavorPatternApp":
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
    case "FlavorHole":
      return "{?}";
    case "FlavorEmptyHole":
      return "?";
    case "FlavorAnn":
      return ":";
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
      return "m";
    case "FlavorCaseWith":
      return "w";
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

const noBodyFlavorContents = (flavor: NodeFlavor): string | undefined => {
  switch (flavor) {
    case "FlavorAnn":
      return "type annotation";
    case "FlavorApp":
      return "apply";
    case "FlavorAPP":
      return "apply type";
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
    case "FlavorTFun":
      return "function type";
    case "FlavorTApp":
      return "apply type";
    case "FlavorTLet":
      return "let type";
    case "FlavorPatternApp":
      return "apply";
    case "FlavorHole":
      return "{?}";
    case "FlavorEmptyHole":
      return "?";
    case "FlavorTEmptyHole":
      return "?";
    case "FlavorTHole":
      return "{?}";
    default:
      return undefined;
  }
};

const primerNodeTypeName = "primer";

type PrimerNodePropsNode = {
  label?: string;
  contents: string | undefined;
  width: number;
  height: number;
  flavor: NodeFlavor;
  selected: boolean;
};

type PrimerNodePropsTree = {
  // Invariant: these will be the same for all nodes in a single tree.
  def: GlobalName;
  nodeType?: NodeType;
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
    const selection = p.selection?.node?.id?.toString();
    return {
      id,
      type: primerNodeTypeName,
      data: {
        def,
        nodeType,
        selected: selection == tree.nodeId,
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
            label: flavorLabel(tree.flavor),
            contents: noBodyFlavorContents(tree.flavor),
            width: p.nodeWidth,
            height: p.nodeHeight,
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
            contents: undefined,
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
