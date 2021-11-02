import "@/index.css";
import { hierarchy, Tree } from "@visx/hierarchy";
import { HierarchyPointNode } from "@visx/hierarchy/lib/types";
import { Group } from "@visx/group";
import { LinkVerticalLine } from "@visx/shape";

import { Tree as TreeI } from "@hackworthltd/primer-types";

export interface TreeVisxI {
  tree: TreeI;
  width: number;
  height: number;
}

export const TreeVisx = ({ width, height, tree }: TreeVisxI): JSX.Element => {
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
                <LinkVerticalLine
                  key={i}
                  data={link}
                  stroke="black"
                  strokeWidth="1"
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
