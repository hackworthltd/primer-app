import "@/index.css";

import BinaryTreeSvg from "./binary-tree.svg?component";

export interface BinaryTreePlaceholderProps {
  className?: string;
}

export const BinaryTreePlaceholder = ({
  className = "",
}: BinaryTreePlaceholderProps): JSX.Element => (
  <div>
    <BinaryTreeSvg className={className} />
  </div>
);
