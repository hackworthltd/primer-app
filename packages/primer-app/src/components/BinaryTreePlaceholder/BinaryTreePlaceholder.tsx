import React from "react";

import "./BinaryTreePlaceholder.css";

import BinaryTreeSvg from "./binary-tree.svg?component";

interface BinaryTreePlaceholderProps {
  className?: string;
}

export const BinaryTreePlaceholder = ({
  className = "",
}: BinaryTreePlaceholderProps) => (
  <div>
    <BinaryTreeSvg className={className} />
  </div>
);
