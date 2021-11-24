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
