/**
 * Generated by orval v6.10.2 🍺
 * Do not edit manually.
 * Primer backend API
 * A backend service implementing a pedagogic functional programming language.
 * OpenAPI spec version: 0.7
 */
import type { ActionType } from "./actionType";
import type { ActionName } from "./actionName";

export interface OfferedAction {
  actionType: ActionType;
  description: string;
  name: ActionName;
  priority: number;
}
