import {
  NodeStyle,
  Tree,
  TreeInteractiveRender,
} from "@hackworthltd/primer-types";
import ReactFlow, {
  Node,
  Edge,
  Handle,
  Position,
  NodeProps,
} from "react-flow-renderer/nocss";
import "react-flow-renderer/dist/style.css";
import useLayout from "./useLayout";

export type TreeReactFlowProps = {
  trees: TreeInteractiveRender[];
  width: number;
  height: number;
  nodeWidth: number;
  nodeHeight: number;
};

const primerNodeTypeNameText = "primerText";
const primerNodeTypeNameBox = "primerBox";
const primerNodeTypeNameNo = "primerNo";
// TODO dry these, e.g. with polymorphism over `body` field
type PrimerNodePropsText = {
  label: string;
  width: number;
  height: number;
  body: string;
  color: string;
};
type PrimerNodePropsBox = {
  label: string;
  width: number;
  height: number;
  body: Tree;
  color: string;
};
type PrimerNodePropsNo = {
  label: string;
  width: number;
  height: number;
  color: string;
};
const PrimerNodeText = (p: NodeProps<PrimerNodePropsText>) => {
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
        <div className="absolute right-0 top-0 rounded border-[3px]">
          {p.data.label}
        </div>
        {p.data.body}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className={handleStyle}
      />
    </>
  );
};
const PrimerNodeBox = (p: NodeProps<PrimerNodePropsBox>) => {
  //TODO draw inner tree (layout will be the hard part)
  //TODO DRY this  with other node components
  // these properties are necessary due to an upstream bug: https://github.com/wbkd/react-flow/issues/2193
  const handleStyle = "absolute border-[2px] border-solid border-grey-tertiary";

  return (
    <>
      <Handle type="target" position={Position.Top} className={handleStyle} />
      <div
        className="flex justify-center items-center text-grey-tertiary rounded border-[3px]"
        style={{
          width: p.data.width / 2, //TODO terrible hack
          height: p.data.height / 2,
          color: p.data.color,
        }}
      >
        {p.data.label}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className={handleStyle}
      />
    </>
  );
};
const PrimerNodeNo = (p: NodeProps<PrimerNodePropsNo>) => {
  //TODO DRY this with other node components
  // these properties are necessary due to an upstream bug: https://github.com/wbkd/react-flow/issues/2193
  const handleStyle = "absolute border-[2px] border-solid border-grey-tertiary";

  return (
    <>
      <Handle type="target" position={Position.Top} className={handleStyle} />
      <div
        className="flex justify-center items-center text-grey-tertiary rounded border-[3px]"
        style={{
          width: p.data.width / 2, //TODO terrible hack
          height: p.data.height / 2,
          color: p.data.color,
        }}
      >
        {p.data.label}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className={handleStyle}
      />
    </>
  );
};
const nodeTypes = {
  [primerNodeTypeNameText]: PrimerNodeText,
  [primerNodeTypeNameBox]: PrimerNodeBox,
  [primerNodeTypeNameNo]: PrimerNodeNo,
};

const convertTree = (
  tree: TreeInteractiveRender,
  nodeWidth: number,
  nodeHeight: number
  // nodes: Node<PrimerNodePropsText>[];
): {
  nodes: Node[];
  edges: Edge[];
} => {
  const tr = tree.rightChild ? [tree.rightChild] : []; //TODO actually render to right, somehow
  const childTrees = tree.childTrees.concat(tr);

  const children = childTrees.map((t) => convertTree(t, nodeWidth, nodeHeight));
  const id = tree.nodeId.toString();
  const thisToChildren: Edge[] = childTrees.map((t) => {
    const target = t.nodeId.toString();
    return {
      id: JSON.stringify([id, target]),
      source: id,
      target,
      style: { stroke: mkColor(tree.style) },
      type: "step",
      className: "stroke-grey-tertiary stroke-[4px]",
    };
  });

  // TODO DRY cases
  // TODO also think about type safety - currently it's easy to switch the name strings and get runtime errors
  switch (tree.body.tag) {
    case "TextBody":
      const thisNode0: Node<PrimerNodePropsText> = {
        id,
        type: primerNodeTypeNameText,
        data: {
          label: tree.label,
          width: nodeWidth,
          height: nodeHeight,
          color: mkColor(tree.style),
          body: tree.body.contents,
        },
        position: { x: 0, y: 0 }, // this gets overwritten by layout algorithm
      };
      return {
        nodes: [thisNode0, ...children.flatMap(({ nodes }) => nodes)],
        edges: [...thisToChildren, ...children.flatMap(({ edges }) => edges)],
      };
    case "NoBody":
      const thisNode1: Node<PrimerNodePropsNo> = {
        id,
        type: primerNodeTypeNameNo,
        data: {
          label: tree.label,
          width: nodeWidth,
          height: nodeHeight,
          color: mkColor(tree.style),
        },
        position: { x: 0, y: 0 }, // this gets overwritten by layout algorithm
      };
      return {
        nodes: [thisNode1, ...children.flatMap(({ nodes }) => nodes)],
        edges: [...thisToChildren, ...children.flatMap(({ edges }) => edges)],
      };
    case "BoxBody": //TODO render boxes
      const thisNode2: Node<PrimerNodePropsBox> = {
        id,
        type: primerNodeTypeNameBox,
        data: {
          label: tree.label,
          width: nodeWidth,
          height: nodeHeight,
          body: tree.body.contents,
          color: mkColor(tree.style),
        },
        position: { x: 0, y: 0 }, // this gets overwritten by layout algorithm
      };
      return {
        nodes: [thisNode2, ...children.flatMap(({ nodes }) => nodes)],
        edges: [...thisToChildren, ...children.flatMap(({ edges }) => edges)],
      };
  }
};

export const TreeReactFlow = (p: TreeReactFlowProps) => {
  console.log(JSON.stringify(p.trees));
  const trees = p.trees.map((t) => convertTree(t, p.nodeWidth, p.nodeHeight));
  const forest = {
    nodes: trees.flatMap(({ nodes }) => nodes),
    edges: trees.flatMap(({ edges }) => edges),
  };
  const layoutedNodes = useLayout(forest.nodes, forest.edges, {
    direction: "TB",
    nodeWidth: p.nodeWidth,
    nodeHeight: p.nodeHeight,
  });

  return (
    <div style={{ height: p.height, width: p.width }}>
      <ReactFlow
        nodes={layoutedNodes}
        edges={forest.edges}
        nodeTypes={nodeTypes}
        style={{ backgroundColor: "lightgray" }}
        proOptions={{ hideAttribution: true, account: "paid-pro" }}
      ></ReactFlow>
    </div>
  );
};

// TODO use custom colours
// TODO black are unimplemented - most don't appear in Ann's designs AFAICT
function mkColor(style: NodeStyle): string {
  switch (style) {
    case "StyleHole":
      return "red";
    case "StyleEmptyHole":
      return "red";
    case "StyleAnn":
      return "black";
    case "StyleApp":
      return "blue";
    case "StyleAPP":
      return "orange";
    case "StyleCon":
      return "green";
    case "StyleLam":
      return "navy";
    case "StyleLAM":
      return "black";
    case "StyleVar":
      return "cyan";
    case "StyleGlobalVarRef":
      return "cyan";
    case "StyleLocalVarRef":
      return "cyan";
    case "StyleLet":
      return "yellow";
    case "StyleLetType":
      return "yellow";
    case "StyleLetrec":
      return "yellow";
    case "StyleCase":
      return "yellow";
    case "StylePrimCon":
      return "black";
    case "StyleTEmptyHole":
      return "black";
    case "StyleTHole":
      return "black";
    case "StyleTCon":
      return "black";
    case "StyleTFun":
      return "black";
    case "StyleTVar":
      return "black";
    case "StyleTApp":
      return "black";
    case "StyleTForall":
      return "black";
    case "StylePattern":
      return "yellow";
  }
}
