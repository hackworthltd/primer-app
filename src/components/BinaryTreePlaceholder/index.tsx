import "@/index.css";

import Placeholder from "./binary-tree.svg?react";

export interface BinaryTreePlaceholderProps {
  className?: string;
}

export const BinaryTreePlaceholder = ({
  className = "",
}: BinaryTreePlaceholderProps): JSX.Element => (
  <div>
    <Placeholder className={className} />
  </div>
);

export default BinaryTreePlaceholder;
