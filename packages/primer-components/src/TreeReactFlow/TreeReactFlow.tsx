import {
  Box,
  EitherBoxTree,
  EitherBoxTreeOneOfTwo,
  Pair,
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

const primerNodeTypeName = "primer";
type PrimerNodeProps = {
  ann: string;
  body?: string;
  width: number;
  height: number;
  color: string;
};
const PrimerNode = (p: NodeProps<PrimerNodeProps>) => {
  // these properties are necessary due to an upstream bug: https://github.com/wbkd/react-flow/issues/2193
  const handleStyle = "absolute border-[2px] border-solid border-grey-tertiary";

  if (p.data.body) {
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
            {p.data.ann}
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
  } else {
    //TODO DRY with other case (once I've decided quite how to render no-body nodes)
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
          {p.data.ann}
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className={handleStyle}
        />
      </>
    );
  }
};
const nodeTypes = { [primerNodeTypeName]: PrimerNode };

const mkBoxId = (box: Box): string => {
  // TODO we "know" that boxes have at least one child (in fact, don't they have exactly one? change API?),
  // and that it isn't another box, but how do we prove that? change API somehow?
  return (
    (
      box.childTrees[0]!.fstPair as EitherBoxTreeOneOfTwo
    ).Right.nodeId.toString() + "box"
  );
};

const mkChildren = (children: Pair[], source: string, colour: string): Edge[] =>
  children.flatMap(({ fstPair: tb }) => {
    //TODO don't ignore direction (I have no idea how we should supply it to dagre, however)
    const target =
      "Right" in tb ? tb.Right.nodeId.toString() : mkBoxId(tb.Left);
    return {
      id: JSON.stringify([source, target]),
      source,
      target,
      type: "step",
      className: "stroke-[4px]",
      style: { stroke: colour },
    };
  });

const convertTreeOrBox = (
  tb: EitherBoxTree,
  nodeWidth: number,
  nodeHeight: number
): {
  nodes: Node<PrimerNodeProps>[];
  edges: Edge[];
} => {
  if ("Right" in tb) {
    return convertTree(tb.Right, nodeWidth, nodeHeight);
  } else {
    return convertBox(tb.Left, nodeWidth, nodeHeight);
  }
};

const convertBox = (
  box: Box,
  nodeWidth: number,
  nodeHeight: number
): {
  nodes: Node<PrimerNodeProps>[];
  edges: Edge[];
} => {
  const boxChildren = box.childTrees.flatMap(({ fstPair: tb }) => {
    return convertTreeOrBox(tb, nodeWidth, nodeHeight);
  });

  const inside = convertTree(box.inside, nodeWidth, nodeHeight);
  const thisToChildren: Edge[] = mkChildren(
    box.childTrees,
    mkBoxId(box),
    box.colour
  );

  return {
    nodes: [
      {
        id: mkBoxId(box),
        type: primerNodeTypeName, //TODO rendering is different enough to deserve own type
        data: {
          //TODO DRY with other node creation (hang on - see comment above about using different type)
          ann: box.ann,
          width: 300, //TODO don't hardcode - needs to be just big enough xto fit contents
          height: 500,
          color: box.colour,
        },
        position: { x: 0, y: 0 }, // this gets overwritten by layout algorithm
      },
      ...boxChildren.flatMap((c) => c.nodes),
      ...inside.nodes.map((n) => {
        return {
          parentNode: mkBoxId(box),
          ...n,
        };
      }),
    ],
    edges: [
      ...boxChildren.flatMap((c) => c.edges),
      ...inside.edges,
      ...thisToChildren,
      //
    ],
  };
};

const convertTree = (
  tree: TreeInteractiveRender,
  nodeWidth: number,
  nodeHeight: number
): {
  nodes: Node<PrimerNodeProps>[];
  edges: Edge[];
} => {
  const id = tree.nodeId.toString();
  const children = tree.childTrees.map(({ fstPair: tb }) => {
    //TODO hmm, is there a better way to "pattern match"? also see elsewhere (`grep "Right"`)
    return convertTreeOrBox(tb, nodeWidth, nodeHeight);
  });
  const thisNode: Node<PrimerNodeProps> = {
    id,
    type: primerNodeTypeName,
    data: {
      ann: tree.ann,
      width: nodeWidth,
      height: nodeHeight,
      color: tree.colour,
      ...(tree.body ? { body: tree.body } : {}), //TODO there's gotta be some shorthand for this
    },
    position: { x: 0, y: 0 }, // this gets overwritten by layout algorithm
  };
  const thisToChildren: Edge[] = mkChildren(tree.childTrees, id, tree.colour);
  return {
    nodes: [thisNode, ...children.flatMap(({ nodes }) => nodes)],
    edges: [...thisToChildren, ...children.flatMap(({ edges }) => edges)],
  };
};

export const TreeReactFlow = (p: TreeReactFlowProps) => {
  console.log(JSON.stringify(p.trees));
  const trees = p.trees.map((t) => convertTree(t, p.nodeWidth, p.nodeHeight));
  const forest = {
    nodes: trees.flatMap(({ nodes }) => nodes),
    edges: trees.flatMap(({ edges }) => edges),
  };
  const layoutedNodes0 = useLayout(forest.nodes, forest.edges, {
    direction: "TB",
    nodeWidth: p.nodeWidth,
    nodeHeight: p.nodeHeight,
  });
  const layoutedNodes = layoutedNodes0.map((n) => {
    return {
      ...n,
      position: n.parentNode
        ? { x: n.position.x - 200, y: n.position.y - 500 }
        : // ? { x: n.position.x, y: n.position.y }
          { x: n.position.x, y: n.position.y },
      // : { x: n.position.x, y: n.position.y },
      // : { x: n.position.x, y: n.position.y },
    };
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

// TODO map colours to styles
// let looks very similar to Var in Ann's designs
// primitives in different colout to normal constructors? needs separate styling somehow (or not, we have that we can't "go to definition")
// Ann, LAM, LetType not in Ann's designs at all?
