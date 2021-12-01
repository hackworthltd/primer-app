import "@/index.css";
import { hierarchy, Tree } from "@visx/hierarchy";
import { HierarchyPointNode } from "@visx/hierarchy/lib/types";
import { Group } from "@visx/group";
import {
  LinkVertical,
  LinkVerticalLine,
  LinkVerticalCurve,
  LinkVerticalStep,
} from "@visx/shape";

import { Tree as TreeI } from "@hackworthltd/primer-types";

export type LinkType = "line" | "step" | "curve" | "diagonal";

export interface TreeVisxI {
  tree: TreeI;
  width: number;
  height: number;
  linkType: LinkType;
}

export const TreeVisx = ({
  width,
  height,
  tree,
  linkType,
}: TreeVisxI): JSX.Element => {
  const mx = width * 0.1;
  const my = height * 0.1;
  const w = width - 2 * mx;
  const h = height - 2 * my;
  //const LL = getLink(linkType)
  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="#c33c55" />
      <Group left={mx} top={my}>
        <Tree
          size={[w, h]}
          separation={(a, b) => (a.parent === b.parent ? 5 : 2) / a.depth}
          root={hierarchy(tree, (t) => t.childTrees)}
        >
          {(tree) => (
            <>
              {tree.descendants().map((node, i) => (
                <Node key={i} node={node} />
              ))}
              {/*tree.links().map((link,i) => <LL 
                 key={i} data={link}
                 stroke="black" strokeWidth="1" fill="none"
                  />)*/}
              {tree.links().map((link, i) => (
                <Link
                  linkType={linkType}
                  key={i}
                  data={link}
                  stroke="black"
                  strokeWidth="1"
                  fill="none"
                />
              ))}
            </>
          )}
        </Tree>
      </Group>
    </svg>
  );
};

type HierarchyNode = HierarchyPointNode<TreeI>;

function Node({ node }: { node: HierarchyNode }): JSX.Element {
  return <circle cx={node.x} cy={node.y} r="5" />;
}

/*
// get an error about return type is too complex to represent!
function getLink(linkType : LinkType) : typeof LinkVerticalLine {
  if (linkType === "line") {
    return LinkVerticalLine
  }
  return LinkVerticalStep
}
*/

// I don't see how to type this nicely
function Link({
  linkType,
  ...args
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: { linkType: LinkType } & any): JSX.Element {
  // I think the type "should" be the following, but it is not exported from visx, so I cannot write this (iiuc)
  // (This is from node_modules/@visx/shape/lib/shapes/link/line/LinkVerticalLine.d.ts)
  //}: { linkType: LinkType } & AddSVGProps<LinkVerticalLineProps<Link, Node>, SVGPathElement>): JSX.Element {
  // How about being fancy? This fails, but I am not sure I am doing it right...
  //}: { linkType: LinkType } & Parameters<typeof LinkVerticalLine>): JSX.Element {
  if (linkType === "line") {
    return <LinkVerticalLine {...args} />;
  }
  if (linkType === "curve") {
    return <LinkVerticalCurve {...args} />;
  }
  if (linkType === "step") {
    return <LinkVerticalStep {...args} />;
  }
  // otherwise, (linkType === "diagonal") {
  return <LinkVertical {...args} />;
}
