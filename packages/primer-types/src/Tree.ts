import * as React from "react";

/**
 *
 * @export
 * @interface Tree
 */
export interface Tree {
  /**
   *
   * @type {Array<Tree>}
   * @memberof Tree
   */
  childTrees: Array<Tree>;
  /**
   *
   * @type {number}
   * @memberof Tree
   */
  nodeId: number;
  /**
   *
   * @type {string}
   * @memberof Tree
   */
  label: string;
}

/**
 * TreeInteractiveRender is like Tree, but has added information for frontend
 * purposes. We add some click handlers, primarily to help visualise how trees
 * dynamically respond to nodes being added and removed. This is only intended
 * for development use, since 'onRightClick' (which is intended to be
 * implemented via 'oncontextmenu') is not usable across all touch/mobile
 * devices.
 *
 * @export
 * @interface TreeInteractiveRender
 */
export interface TreeInteractiveRender {
  /**
   *
   * @type {Array<Tree>}
   * @memberof Tree
   */
  childTrees: Array<Tree>;
  /**
   *
   * @type {number}
   * @memberof Tree
   */
  nodeId: number;
  /**
   *
   * @type {string}
   * @memberof Tree
   */
  label: string;
  /**
   *
   * @type {React.MouseEventHandler<unknown>}
   * @memberof Tree
   */
  onClick?: React.MouseEventHandler<unknown>;
  /**
   *
   * @type {React.MouseEventHandler<unknown>}
   * @memberof Tree
   */
  onRightClick?: React.MouseEventHandler<unknown>;
}
