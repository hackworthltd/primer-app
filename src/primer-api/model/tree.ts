/**
 * Generated by orval v6.10.2 🍺
 * Do not edit manually.
 * Primer backend API
 * A backend service implementing a pedagogic functional programming language.
 * OpenAPI spec version: 0.7
 */
import type { NodeBody } from "./nodeBody";
import type { NodeFlavor } from "./nodeFlavor";

export interface Tree {
  body: NodeBody;
  childTrees: Tree[];
  flavor: NodeFlavor;
  nodeId: string;
  rightChild?: Tree;
}