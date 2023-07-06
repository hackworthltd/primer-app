import { Route } from "@tanstack/router";
import { rootRoute } from "@/router";
import { NoMatch } from "@/components";

export const catchAllRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NoMatch,
});
