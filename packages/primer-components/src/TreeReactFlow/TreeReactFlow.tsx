import { NodeFlavor, TreeInteractiveRender } from "@hackworthltd/primer-types";
import ReactFlow, {
  Edge,
  Node,
  Handle,
  Position,
  NodeProps,
} from "react-flow-renderer/nocss";
import "react-flow-renderer/dist/style.css";
import { layoutGraph, NodeNoPos } from "./layoutGraph";
import { useMemo } from "react";

type NodeParams = {
  nodeWidth: number;
  nodeHeight: number;
};
export type TreeReactFlowProps = {
  trees: TreeInteractiveRender[];
  width: number;
  height: number;
} & NodeParams;

function flavorColor(flavor: NodeFlavor): string {
  switch (flavor) {
    case "FlavorHole":
      return "#cd3764";
    case "FlavorEmptyHole":
      return "#cd3764";
    case "FlavorAnn":
      return "black";
    case "FlavorApp":
      return "#2c6a85";
    case "FlavorAPP":
      return "e5a34f";
    case "FlavorCon":
      return "#62e2b4";
    case "FlavorLam":
      return "#34375d";
    case "FlavorLAM":
      return "black";
    case "FlavorGlobalVar":
      return "#64b0c8";
    case "FlavorLocalVar":
      return "#64b0c8";
    case "FlavorLet":
      return "#64b0c8";
    case "FlavorLetType":
      return "#64b0c8";
    case "FlavorLetrec":
      return "#64b0c8";
    case "FlavorCase":
      return "#ffb961";
    case "FlavorPrimCon":
      return "black";
    case "FlavorTEmptyHole":
      return "black";
    case "FlavorTHole":
      return "black";
    case "FlavorTCon":
      return "black";
    case "FlavorTFun":
      return "black";
    case "FlavorTVar":
      return "black";
    case "FlavorTApp":
      return "black";
    case "FlavorTForall":
      return "black";
    case "FlavorPattern":
      return "#ffb961";
    case "FlavorPatternCon":
      return "black";
    case "FlavorPatternBind":
      return "black";
    case "FlavorPatternApp":
      return "black";
  }
}

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
type PrimerNodeProps = {
  label?: string;
  contents?: string;
  width: number;
  height: number;
  color: string;
};
const PrimerNode = (p: NodeProps<PrimerNodeProps>) => {
  // these properties are necessary due to an upstream bug: https://github.com/wbkd/react-flow/issues/2193
  const handleStyle = "absolute border-[2px] border-solid border-grey-tertiary";

  return (
    <>
      <Handle type="target" position={Position.Top} className={handleStyle} />
      <div
        className="flex justify-center items-center text-grey-tertiary rounded border-[3px]"
        style={{
          width: p.data.width,
          height: p.data.height,
          color: p.data.color,
        }}
      >
        {p.data.contents}
        {p.data.label ? (
          <div className="absolute right-0 top-0 rounded border-[3px]">
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
  tree: TreeInteractiveRender,
  p: NodeParams
): {
  nodes: NodeNoPos<PrimerNodeProps>[];
  edges: Edge<{}>[];
  /* Nodes of nested trees, already positioned.
  We have to lay these out first in order to know the dimensions of boxes to be drawn around them.*/
  nested: Node<PrimerNodeProps>[];
} => {
  const childTrees = tree.childTrees.concat(
    tree.rightChild ? [tree.rightChild] : []
  );
  const children = childTrees.map((t) => convertTree(t, p));
  const id = tree.nodeId.toString();
  const thisNode = (data: PrimerNodeProps): NodeNoPos<PrimerNodeProps> => {
    return {
      id,
      type: primerNodeTypeName,
      data,
    };
  };
  const thisToChildren: Edge<{}>[] = childTrees.map((t) => {
    const target = t.nodeId.toString();
    return {
      id: JSON.stringify([id, target]),
      source: id,
      target,
      type: "step",
      style: { stroke: flavorColor(tree.flavor) },
      className: "stroke-[4px]",
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
            color: flavorColor(tree.flavor),
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
            color: flavorColor(tree.flavor),
          }),
          ...childNodes,
        ],
        edges,
        nested: childNested,
      };
    case "BoxBody":
      const bodyTree = convertTree(tree.body.contents, p);
      const bodyLayout = layoutGraph(
        bodyTree.nodes.map((node) => {
          return {
            ...node,
            parentNode: id,
          };
        }),
        bodyTree.edges
      );
      return {
        nodes: [
          thisNode({
            label: flavorLabel(tree.flavor),
            width: bodyLayout.width,
            height: bodyLayout.height,
            color: flavorColor(tree.flavor),
          }),
          ...childNodes,
        ],
        edges: edges.concat(bodyTree.edges),
        nested: childNested.concat(bodyLayout.nodes),
      };
  }
};

export const TreeReactFlow = (p: TreeReactFlowProps) => {
  const { nodes, edges } = useMemo(() => {
    const trees = p.trees.map((t) => convertTree(t, p));
    const edges = trees.flatMap(({ edges }) => edges);
    const nodes = trees.flatMap(({ nodes }) => nodes);
    const nested = trees.flatMap(({ nested }) => nested);
    return {
      nodes: layoutGraph(nodes, edges).nodes.concat(nested),
      edges,
    };
  }, [p]);

  return (
    <div style={{ height: p.height, width: p.width }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true, account: "paid-pro" }}
      ></ReactFlow>
    </div>
  );
};
