/**
 * Generated by orval v6.27.1 🍺
 * Do not edit manually.
 * Primer backend API
 * A backend service implementing a pedagogic functional programming language.
 * OpenAPI spec version: 0.7
 */
import type { ValCon } from './valCon';
import type { GlobalName } from './globalName';
import type { TypeParam } from './typeParam';

export interface TypeDef {
  constructors?: ValCon[];
  name: GlobalName;
  nameHints: string[];
  params: TypeParam[];
}
