import "@/index.css";

import { ReactComponent as BinaryTreeSvg } from "./binary-tree.svg";

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
