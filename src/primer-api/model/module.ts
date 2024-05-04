/**
 * Generated by orval v6.27.1 🍺
 * Do not edit manually.
 * Primer backend API
 * A backend service implementing a pedagogic functional programming language.
 * OpenAPI spec version: 0.7
 */
import type { Def } from './def';
import type { TypeDef } from './typeDef';

export interface Module {
  defs: Def[];
  editable: boolean;
  /** @minItems 1 */
  modname: string[];
  types: TypeDef[];
}
