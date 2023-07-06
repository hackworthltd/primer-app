import { Navigate, Route } from "@tanstack/router";

import { rootRoute } from "@/router";

const Root = (): JSX.Element => <Navigate from="/" to="/sessions" />;

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Root,
});
