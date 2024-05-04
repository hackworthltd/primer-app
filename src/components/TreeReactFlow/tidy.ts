// Note: this source file has been vendored from https://github.com/zxch3n/tidy, originally from this commit:
//
// https://github.com/zxch3n/tidy/commit/54382fae3a9e85ac8329fa89d5a83632f20c2cde
//
// It is licensed separately from the rest of the project under the MIT license, as follows:

// MIT License
//
// Copyright (c) 2022 Zixuan Chen
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { Tidy, Tidy as TidyWasm, WasmLayoutType as LayoutType } from '@hackworthltd/tidyt-wasm';
import { Disposable } from './dispose';

export { LayoutType };

function visit<T extends { children: T[] }>(
  node: T,
  func: (node: T, depth: number) => void,
  depth = 0,
) {
  func(node, depth);
  for (const child of node.children) {
    visit(child, func, depth + 1);
  }
}

export interface Node {
  id?: number;
  width: number;
  height: number;
  parentId?: number;
  x: number;
  y: number;
  children: Node[];
}

export interface InnerNode {
  id: number;
  width: number;
  height: number;
  parentId?: number;
  x: number;
  y: number;
  children: InnerNode[];
}

let nullId = -1;
const NULL_ID = () => {
  if (nullId === -1) {
    nullId = Tidy.null_id();
  }
  return nullId;
};
export class TidyLayout extends Disposable {
  private tidy: TidyWasm;
  private nextId = 1;
  private root: InnerNode | undefined;
  private idToNode: Map<number, InnerNode> = new Map();
  static async create(
    type: LayoutType = LayoutType.Tidy,
    parent_child_margin = 40,
    peer_margin = 10,
  ) {
    return new TidyLayout(type, parent_child_margin, peer_margin);
  }

  private constructor(
    type: LayoutType = LayoutType.Tidy,
    parent_child_margin: number,
    peer_margin: number,
  ) {
    super();
    if (type === LayoutType.Basic) {
      this.tidy = TidyWasm.with_basic_layout(parent_child_margin, peer_margin);
    } else if (type === LayoutType.Tidy) {
      this.tidy = TidyWasm.with_tidy_layout(parent_child_margin, peer_margin);
    } else if (type === LayoutType.LayeredTidy) {
      this.tidy = TidyWasm.with_layered_tidy(parent_child_margin, peer_margin);
    } else {
      throw new Error('not implemented');
    }
    this._register({
      dispose: () => {
        this.tidy.free();
      },
    });
  }

  changeLayoutType(type: LayoutType) {
    this.tidy.change_layout(type);
  }

  layout(updated = false) {
    if (updated) {
      this.update();
    }

    this.tidy.layout();
    const positions = this.tidy.get_pos();
    for (let i = 0; i < positions.length; i += 3) {
      // Better error handling needed here when the id is undefined.
      //
      // https://github.com/hackworthltd/primer-app/issues/1189
      const id = positions[i] || 0;
      const node = this.idToNode.get(id)!;

      // Also need better error handling here when the node's x or y
      // position is undefined.
      //
      // https://github.com/hackworthltd/primer-app/issues/1189
      node.x = positions[i + 1] || 0;
      node.y = positions[i + 2] || 0;
    }
  }

  update() {
    const removedNodeId = new Set(this.idToNode.keys());
    visit(this.root!, (node) => {
      removedNodeId.delete(node.id);
      if (this.idToNode.has(node.id)) {
        return;
      }

      this.idToNode.set(node.id, node);
      this.tidy.add_node(
        node.id,
        node.width,
        node.height,
        node.parentId ?? NULL_ID(),
      );
    });

    for (const nodeId of removedNodeId) {
      this.tidy.remove_node(nodeId);
      this.idToNode.delete(nodeId);
    }
  }

  set_root(root: Node): InnerNode {
    //TODO: Free old nodes
    const stack = [root];
    const ids: number[] = [];
    const width: number[] = [];
    const height: number[] = [];
    const parents: number[] = [];
    while (stack.length) {
      const node = stack.pop()!;
      if (node.id == null) {
        node.id = this.nextId++;
      }

      ids.push(node.id!);
      width.push(node.width);
      height.push(node.height);
      parents.push(node.parentId ?? NULL_ID());
      this.idToNode.set(node.id!, node as InnerNode);
      for (const child of node.children.concat().reverse()) {
        if (child.parentId == null) {
          child.parentId = node.id;
        }

        stack.push(child);
      }
    }

    this.root = root as InnerNode;
    this.tidy.data(
      new Uint32Array(ids),
      new Float64Array(width),
      new Float64Array(height),
      new Uint32Array(parents),
    );

    return this.root;
  }
}
