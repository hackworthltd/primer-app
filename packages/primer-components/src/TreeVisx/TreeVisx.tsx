import "@/index.css";
import { hierarchy, Tree } from "@visx/hierarchy";
import { HierarchyPointNode } from "@visx/hierarchy/lib/types";
import { Group } from "@visx/group";

import { Tree as TreeI } from "@hackworthltd/primer-types";

export interface TreeVisxI {
  tree: TreeI;
  width: number;
  height: number;
}

export const TreeVisx = ({ width, height, tree }: TreeVisxI): JSX.Element => {
  const mx = width * 0.1;
  const my = height * 0.1;
  const w = width - 2 * mx;
  const h = height - 2 * my;
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
