/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Primer backend API
 * A backend service implementing a pedagogic functional programming language.
 * OpenAPI spec version: 0.7
 */
import type { Tree } from './tree';
import type { TypeOrKindOneOfThreeTag } from './typeOrKindOneOfThreeTag';

export type TypeOrKindOneOfThree = {
  contents: Tree;
  tag: TypeOrKindOneOfThreeTag;
};