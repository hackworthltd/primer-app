import "@/index.css";

import { Tree } from "@hackworthltd/primer-types";

export const TreeOutline = (tree: Tree): JSX.Element => (
  <ul className="ml-2 list-disc list-outside">
    <li>{tree.label}</li>
    <ChildTrees trees={tree.childTrees} />
  </ul>
);

function ChildTrees({ trees }: { trees: Tree[] }): JSX.Element {
  if (trees.length > 0) {
    return (
      <ul className="ml-2 list-disc list-outside">
        {trees.map((t) => (
          <TreeOutline {...t} key={t.nodeId} />
        ))}
      </ul>
    );
  }
  return <></>;
}
