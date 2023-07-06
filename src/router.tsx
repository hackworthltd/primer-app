import { Outlet, RootRoute, Router } from "@tanstack/router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { indexRoute } from "@/routes";
import { sessionsRoute } from "@/routes/sessions";
import { sessionIdRoute } from "@/routes/sessions/sessionId";
import { catchAllRoute } from "@/routes/catchAll";

export const rootRoute = new RootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  sessionsRoute.addChildren([sessionIdRoute]),
  catchAllRoute,
]);

export const router = new Router({ routeTree });

declare module "@tanstack/router" {
  interface Register {
    router: typeof router;
  }
}
