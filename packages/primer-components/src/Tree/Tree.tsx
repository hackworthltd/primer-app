import "@/index.css";

import { TreeI } from "@hackworthltd/primer-types";

export const Tree = (tree: TreeI): JSX.Element => (
  <ul className="ml-2 list-disc list-outside">
    <li>{tree.label}</li>
    <ChildTrees trees={tree.childTrees} />
  </ul>
);

function ChildTrees({ trees }: { trees: TreeI[] }): JSX.Element {
  if (trees.length > 0) {
    return (
      <ul className="ml-2 list-disc list-outside">
        {trees.map((t) => (
          <Tree {...t} key={t.nodeId} />
        ))}
      </ul>
    );
  }
  return <></>;
}
