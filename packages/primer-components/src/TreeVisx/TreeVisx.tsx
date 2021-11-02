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
import { AddSVGProps } from "@visx/shape/lib/types";
import { LinkVerticalLineProps } from "@visx/shape/lib/shapes/link/line/LinkVerticalLine";

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
  // TODO: We should enable external control over node and edge styling
  // See https://github.com/hackworthltd/primer-app/issues/204

  // Add a small (10%) margin to our svg, otherwise Tree decides to position
  // nodes very close to the edge, and they are visually cut off
  const mx = width * 0.1;
  const my = height * 0.1;
  const w = width - 2 * mx;
  const h = height - 2 * my;
  return (
    <svg width={width} height={height}>
      <Group left={mx} top={my}>
        <Tree size={[w, h]} root={hierarchy(tree, (t) => t.childTrees)}>
          {(tree) => (
            <>
              {tree.descendants().map((node, i) => (
                <Node key={i} node={node} />
              ))}
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

type LT<Link, Node> = AddSVGProps<
  LinkVerticalLineProps<Link, Node>,
  SVGPathElement
>;

function Link<Link, Node>({
  linkType,
  ...args
}: { linkType: LinkType } & LT<Link, Node>): JSX.Element {
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
