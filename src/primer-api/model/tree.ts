/**
 * Generated by orval v6.19.1 🍺
 * Do not edit manually.
 * Primer backend API
 * A backend service implementing a pedagogic functional programming language.
 * OpenAPI spec version: 0.7
 */
import type { NodeBody } from './nodeBody';

export interface Tree {
  body: NodeBody;
  childTrees: Tree[];
  nodeId: string;
  rightChild?: Tree;
}
