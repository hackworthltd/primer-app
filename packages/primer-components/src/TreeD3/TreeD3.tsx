import "@/index.css";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { HierarchyLink, HierarchyPointNode } from "@visx/hierarchy/lib/types";

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

  const d3tree = d3.tree().size([width, height]);

  const layout = d3tree(hier);

  // We create the link group before the node group, so that all links will be
  // rendered below the nodes
  const linkG = svg
    .append("g")
    .attr("stroke", "#000")
    .attr("fill", "none")
    .selectAll();

  // TODO: We should enable external control over node and edge styling
  // See https://github.com/hackworthltd/primer-app/issues/204

  const nodeG = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .selectAll();

  nodeG
    .data(layout)
    .enter()
    .append("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", 5);

  const link = d3.linkVertical<
    HierarchyLink<TreeInteractiveRender>,
    HierarchyPointNode<TreeInteractiveRender>
  >();

  linkG
    .data(hier.links())
    .enter()
    .append("path")
    .attr(
      "d",
      link.x((d) => d.x).y((d) => d.y)
    );
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
    const svg = svgRef.current;
    d3graph(w, h, svg, tree);
    return () => {
      // This cleans up, which is important since d3graph only ever adds DOM
      // nodes. If we did not do this, we would get multiple stale copies of
      // stuff inside the svg when we rerender.
      svg && (svg.innerHTML = "");
    };
  }, [svgRef, tree, w, h]);
  return (
    <div>
      <svg width={width} height={height}>
        <g ref={svgRef} transform={`translate(${mx},${my})`} />
      </svg>
    </div>
  );
}
