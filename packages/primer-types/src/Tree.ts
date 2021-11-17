export interface TreeI {
  nodeId: number;
  label: string;
  /* NB: 'children' is treated specially by react, leading to weird errors.
   * Let's avoid that word.
   */
  childTrees: TreeI[];
}

