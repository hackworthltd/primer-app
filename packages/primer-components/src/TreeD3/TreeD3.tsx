import "@/index.css";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  HierarchyPointLink,
  HierarchyLink,
  HierarchyPointNode,
} from "@visx/hierarchy/lib/types";

import { TreeInteractiveRender } from "@hackworthltd/primer-types";
import { TreeVisxI } from "@/TreeVisx";

function d3graph(
  width: number,
  height: number,
  svgRef: null | SVGElement,
  tree: TreeInteractiveRender
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

  const link = linkG
    .selectAll<SVGPathElement, HierarchyPointLink<TreeInteractiveRender>>(
      ".link"
    )
    .data(layout.links(), (l) => l.target.data.nodeId);

  const node = nodeG
    .selectAll<SVGCircleElement, HierarchyPointNode<TreeInteractiveRender>>(
      ".node"
    )
    .data(layout, (n) => n.data.nodeId);

  node
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
    .merge(node)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y);

  node.exit().remove();

  const drawLink = d3.linkVertical<
    HierarchyLink<TreeInteractiveRender>,
    HierarchyPointNode<TreeInteractiveRender>
  >();

  link
    .enter()
    .append("path")
    .attr("class", "link")
    .merge(link)
    .attr(
      "d",
      drawLink.x((d) => d.x).y((d) => d.y)
    );

  link.exit().remove();
}

export function TreeD3({ width, height, tree }: TreeVisxI) {
  // Add a small (10%) margin to our svg, otherwise Tree decides to position
  // nodes very close to the edge, and they are visually cut off
  const mx = width * 0.1;
  const my = height * 0.1;
  const w = width - 2 * mx;
  const h = height - 2 * my;
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    d3graph(w, h, svgRef.current, tree);
  }, [svgRef, tree, w, h]);
  return (
    <div>
      <svg width={width} height={height}>
        <g ref={svgRef} transform={`translate(${mx},${my})`} />
      </svg>
    </div>
  );
}
