/**
 * Generated by orval v6.26.0 🍺
 * Do not edit manually.
 * Primer backend API
 * A backend service implementing a pedagogic functional programming language.
 * OpenAPI spec version: 0.7
 */
import type { GlobalName } from './globalName';
import type { NodeSelection } from './nodeSelection';

export interface DefSelection {
  def: GlobalName;
  node?: NodeSelection;
}
