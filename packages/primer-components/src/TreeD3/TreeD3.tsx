import "@/index.css";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  HierarchyPointLink,
  HierarchyPointNode,
} from "@visx/hierarchy/lib/types";

import { TreeInteractiveRender } from "@hackworthltd/primer-types";
import { TreeVisxI } from "@/TreeVisx";

type Pt = { x: number; y: number };

function d3graph(
  width: number,
  height: number,
  svgRef: null | SVGElement,
  tree: TreeInteractiveRender,
  oldPos: Map<number, Pt>
) {
  const svg = d3.select(svgRef);

  const hier = d3.hierarchy(tree, (d) => d.childTrees);

  const d3tree = d3.tree<TreeInteractiveRender>().size([width, height]);

  const layout = d3tree(hier);

  // We create the link group before the node group, so that all links will be
  // rendered below the nodes
  let linkG: d3.Selection<SVGGElement, unknown, null, unknown> =
    svg.select(".linkG");
  if (linkG.empty()) {
    linkG = svg
      .append("g")
      .attr("class", "linkG")
      .attr("stroke", "#000")
      .attr("fill", "none");
  }

  // TODO: We should enable external control over node and edge styling
  // See https://github.com/hackworthltd/primer-app/issues/204

  let nodeG: d3.Selection<SVGGElement, unknown, null, unknown> =
    svg.select(".nodeG");
  if (nodeG.empty()) {
    nodeG = svg
      .append("g")
      .attr("class", "nodeG")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);
  }

  let link = linkG
    .selectAll<SVGPathElement, HierarchyPointLink<TreeInteractiveRender>>(
      ".link"
    )
    .data(layout.links(), (l) => l.target.data.nodeId);

  let node = nodeG
    .selectAll<SVGCircleElement, HierarchyPointNode<TreeInteractiveRender>>(
      ".node"
    )
    .data(layout, (n) => n.data.nodeId);

  function getPos(d: HierarchyPointNode<TreeInteractiveRender>) {
    // return the nearest parent's position from oldPos
    // falling back to new position from layout
    let p = { x: d.x, y: d.y };
    let n: null | typeof d = d;
    while (n) {
      const tmp = oldPos.get(n.data.nodeId);
      if (tmp) {
        p = tmp;
        break;
      }
      n = n.parent;
    }
    return p;
  }

  node
    .exit<HierarchyPointNode<TreeInteractiveRender>>()
    // delete remembered old positions for no-longer existing nodes
    .each((d) => oldPos.delete(d.data.nodeId))
    .remove();

  node = node
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 5)
    .on("click", (e, d) => {
      if (d.data.onClick) {
        d.data.onClick(e);
      }
    })
    .on("contextmenu", (e, d) => {
      if (d.data.onRightClick) {
        d.data.onRightClick(e);
      }
    })
    // Nodes enter at their parent's currently rendered position (i.e. the
    // parent's oldPos). Later, we animate all nodes into their new position.
    // This gives a "growing" visual effect.
    .each(function (d) {
      const p = getPos(d);
      d3.select(this).attr("cx", p.x).attr("cy", p.y);
    })
    .merge(node);

  const drawLink = d3
    .linkVertical<
      { source: Pt; target: Pt },
      HierarchyPointNode<TreeInteractiveRender>
    >()
    .x((d) => d.x)
    .y((d) => d.y);

  link.exit().remove();

  link = link
    .enter()
    .append("path")
    .attr("class", "link")
    // Links enter as a zero-length path at their source's currently rendered
    // position (i.e. the source's oldPos). Later, we animate all links into
    // their new position. This gives a "growing" visual effect.
    .attr("d", (d) => {
      const s = getPos(d.source);
      return drawLink({ source: s, target: s });
    })
    .merge(link);

  // Now transition to new position
  // TODO: We should enable external control over transition timing
  // See https://github.com/hackworthltd/primer-app/issues/204
  const duration = 500;
  const t = (svg as d3.Selection<d3.BaseType, unknown, null, unknown>)
    .transition()
    .duration(duration);
  node
    .transition(t)
    .attr("cx", (d) => {
      // remember the node's position for next render as well as doing the animation
      oldPos.set(d.data.nodeId, { x: d.x, y: d.y });
      return d.x;
    })
    .attr("cy", (d) => d.y);
  link.transition(t).attr("d", drawLink);
}

export function TreeD3({ width, height, tree }: TreeVisxI) {
  // Add a small (10%) margin to our svg, otherwise Tree decides to position
  // nodes very close to the edge, and they are visually cut off
  const mx = width * 0.1;
  const my = height * 0.1;
  const w = width - 2 * mx;
  const h = height - 2 * my;
  const svgRef = useRef<SVGSVGElement>(null);
  // oldPos is used to remember last position of nodes, for doing animations.
  // It is imperatively mutated by d3graph.
  // To do our insertion animation, we need to know where the parent node was
  // at the end of the last render cycle (i.e. where it is now, before we start
  // any animation). This is in the selection.data(...), attached to the dom
  // nodes, but we need to bind new data, overwriting this, before we need the
  // old value. It is presumably possible to read this out of the old data or
  // attributes internally to d3graph, but it is easier to just record it
  // manually in this map. Note that a user of this TreeD3 component does not
  // have to care about this implementation detail.
  const oldPos = useRef(new Map());

  useEffect(() => {
    d3graph(w, h, svgRef.current, tree, oldPos.current);
  }, [svgRef, tree, w, h]);
  return (
    <div>
      <svg width={width} height={height}>
        <g ref={svgRef} transform={`translate(${mx},${my})`} />
      </svg>
    </div>
  );
}
