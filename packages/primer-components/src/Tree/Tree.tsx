import "@/index.css";

export interface TreeI {
  nodeId: number;
  label: string;
  /* NB: 'children' is treated specially by react, leading to weird errors.
   * Let's avoid that word.
   */
  childTrees: TreeI[];
}

const ulTop = "flex relative pt-3";
const ulul =
  ulTop +
  " before:border-l-2 before:border-solid before:h-3 \
    before:left-1/2 before:absolute before:top-0 before:w-0";
const ulliTop = "float-left relative text-center pt-3";
const ulliOnly = "float-left relative text-center";
const ulli =
  "float-left relative text-center pt-3\
   before:border-t-2 before:border-solid before:h-3 before:absolute \
   before:right-1/2 before:w-1/2 before:top-0 \
   after:border-t-2 after:border-l-2 after:border-solid after:h-3 after:absolute \
   after:left-1/2 after:w-1/2 after:top-0 \
   first:before:border-none last:after:border-t-0 \
  ";
const nod = "bg-blue-200 bg-opacity-50 mx-3 w-auto border-solid border-1";

export const Tree = (tree: TreeI): JSX.Element => (
  <ul className={ulTop}>
    <li className={ulliTop}>
      <TreeHelper {...tree} />
    </li>
  </ul>
);

function TreeHelper({ label, childTrees }: TreeI): JSX.Element {
  const n = <span className={nod}>{label}</span>;
  let s = <></>;
  if (childTrees.length > 0) {
    s = (
      <ul className={ulul}>
        {childTrees.map((t) => (
          <li
            key={t.nodeId}
            className={childTrees.length == 1 ? ulliOnly : ulli}
          >
            <TreeHelper {...t} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      {n}
      {s}
    </>
  );
}
