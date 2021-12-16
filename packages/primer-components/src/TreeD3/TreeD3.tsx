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
  oldPos: Map<number, Pt>,
  bbs: Map<number, DOMRect>
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
    nodeG = svg.append("g").attr("class", "nodeG");
  }

  let link = linkG
    .selectAll<SVGPathElement, HierarchyPointLink<TreeInteractiveRender>>(
      ".link"
    )
    .data(layout.links(), (l) => l.target.data.nodeId);

  let node = nodeG
    .selectAll<SVGGElement, HierarchyPointNode<TreeInteractiveRender>>(".node")
    .data(layout, (n) => n.data.nodeId);

  function getPos(d: HierarchyPointNode<TreeInteractiveRender>) {
    // return the nearest parent's position from oldPos
    // falling back to new position of root
    let n = d;
    const tmp = oldPos.get(n.data.nodeId);
    if (tmp) {
      return tmp;
    }
    while (n.parent) {
      n = n.parent;
      const tmp = oldPos.get(n.data.nodeId);
      if (tmp) {
        return tmp;
      }
    }
    return { x: n.x, y: n.y };
  }

  const nodeExit = node
    .exit<HierarchyPointNode<TreeInteractiveRender>>()
    // delete remembered old positions for no-longer existing nodes
    // but don't remove the DOM node yet - we will fade it out later
    // also delete remembered bounding box
    .each((d) => {
      oldPos.delete(d.data.nodeId);
      bbs.delete(d.data.nodeId);
    });

  const nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    // An opacity=1 is default, but we need the explicit attribute so we can
    // smoothly animate opacity to zero as nodes exit, to visually fade them
    // out
    .attr("opacity", 1)
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
      d3.select(this).attr("x", p.x).attr("y", p.y);
    });

  // Text (e.g. for node labels) is a bit awkward to deal with, as it is not
  // obvious how large it is. Our strategy here is to ask the browser for the
  // text's bounding box, and from then on only care about the bounding box.
  // This is made slightly awkward by the fact we want to animate our trees,
  // which means our nodes (and their labels) will move around and be rescaled.
  // Concretely, our strategy is:
  // - Use a svg group per node. This will contain the textual label and any
  //   decorations (e.g. a background)
  // - Consider this group to introduce a new local coordinate system: inside
  //   it we will draw everything at (or near) the origin, at full scale, and
  //   then we will translate and scale the group as a whole.
  // - This translation/scaling of the group will keep the center of text label
  //   at the computed node position
  // We achieve this by:
  // - Initially, have no transform on the group
  // - Add a text label to the node, then compute its bounding box (and
  //   remember this in bbs)
  // - We then add a background of exactly that size
  //   (actually, for technical reasons, it is easier to do this after the next
  //   point)
  // - Now transform the group to scale it to a point and position it at the
  //   initial node position, ready for an entry animation ("grow out of the
  //   parent")
  // - Later, in the animation phase, we will recall the cached bounding box to
  //   compute the transform to put the group into final position.
  nodeEnter
    .append("text")
    .text((d) => d.data.label)
    .attr("x", 0)
    .attr("y", 0)
    .attr("fill", "white"); // TODO: do we need the 0,0?
  nodeEnter.each(function (d) {
    const bb = this.getBBox();
    bbs.set(d.data.nodeId, bb);
    const p = getPos(d);
    d3.select(this)
      .attr("transform", `translate(${p.x},${p.y}) scale(0)`)
      .insert("rect", ":first-child")
      .attr("width", bb.width)
      .attr("height", bb.height)
      .attr("x", bb.x)
      .attr("y", bb.y)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);
  });

  node = node.merge(nodeEnter);

  const drawLink = d3
    .linkVertical<
      { source: Pt; target: Pt },
      HierarchyPointNode<TreeInteractiveRender>
    >()
    .x((d) => d.x)
    .y((d) => d.y);

  // Don't remove the DOM nodes yet - we will fade them out later
  const linkExit = link.exit();

  link = link
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("opacity", 1)
    // Links enter as a zero-length path at their source's currently rendered
    // position (i.e. the source's oldPos). Later, we animate all links into
    // their new position. This gives a "growing" visual effect.
    .attr("d", (d) => {
      const s = getPos(d.source);
      return drawLink({ source: s, target: s });
    })
    .merge(link);

  // Fade out the old nodes and links (if any)
  // TODO: We should enable external control over transition timing
  // See https://github.com/hackworthltd/primer-app/issues/204
  const durationExit = nodeExit.empty() && linkExit.empty() ? 0 : 500;
  const tExit = (svg as d3.Selection<d3.BaseType, unknown, null, unknown>)
    .transition()
    .duration(durationExit);
  nodeExit.transition(tExit).attr("opacity", 0).remove();
  linkExit.transition(tExit).attr("opacity", 0).remove();

  // Now transition to new position
  const durationMove = 500;
  const tMove = tExit.transition().duration(durationMove);
  node.transition(tMove).attr("transform", function (d) {
    // remember the node's position for next render as well as doing the animation
    oldPos.set(d.data.nodeId, { x: d.x, y: d.y });
    // bbs.get(..) should never be null, as we have set this index of bbs when
    // the node entered
    const bb = bbs.get(d.data.nodeId) || { x: 0, y: 0, width: 0, height: 0 };
    return `translate(${
      d.x - bb.x - bb.width / 2
    },${d.y - bb.y - bb.height / 2})`;
  });
  link.transition(tMove).attr("d", drawLink);
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
  // bbs is used to remember bounding box sizes (i.e. text sizes). It is used
  // similarly to oldPos, but is updated on entry rather than update
  const bbs = useRef(new Map());

  useEffect(() => {
    d3graph(w, h, svgRef.current, tree, oldPos.current, bbs.current);
  }, [svgRef, tree, w, h]);
  return (
    <div>
      <svg width={width} height={height}>
        <g ref={svgRef} transform={`translate(${mx},${my})`} />
      </svg>
    </div>
  );
}
