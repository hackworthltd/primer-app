import "@/index.css";

import { TreeInteractiveRender } from "@hackworthltd/primer-types";

export const TreeOutline = (tree: TreeInteractiveRender): JSX.Element => (
  <ul className="ml-2 list-disc list-inside">
    <li onClick={tree.onClick} onContextMenu={tree.onRightClick}>
      {/*  @ts-expect-error */}

      {tree.label}
    </li>
    {/*  @ts-expect-error */}
    <ChildTrees trees={tree.childTrees} />
  </ul>
);

function ChildTrees({
  trees,
}: {
  trees: TreeInteractiveRender[];
}): JSX.Element {
  if (trees.length > 0) {
    return (
      <ul className="ml-2 list-disc list-inside">
        {trees.map((t) => (
          <TreeOutline {...t} key={t.nodeId} />
        ))}
      </ul>
    );
  }
  return <></>;
}
