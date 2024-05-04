/**
 * Generated by orval v6.27.1 🍺
 * Do not edit manually.
 * Primer backend API
 * A backend service implementing a pedagogic functional programming language.
 * OpenAPI spec version: 0.7
 */
import type { NodeBody } from './nodeBody';
import type { RecordPairEdgeFlavorTree } from './recordPairEdgeFlavorTree';

export interface Tree {
  body: NodeBody;
  childTrees: RecordPairEdgeFlavorTree[];
  nodeId: string;
  rightChild?: RecordPairEdgeFlavorTree;
}
