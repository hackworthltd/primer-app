/**
 * Generated by orval v6.11.1 🍺
 * Do not edit manually.
 * Primer backend API
 * A backend service implementing a pedagogic functional programming language.
 * OpenAPI spec version: 0.7
 */
import type { Def } from './def';
import type { GlobalName } from './globalName';

export interface Module {
  defs: Def[];
  editable: boolean;
  modname: string[];
  types: GlobalName[];
}
