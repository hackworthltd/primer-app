import { Route } from "@tanstack/router";

import { rootRoute } from "@/router";
import { ChooseSession } from "@/components";

const SessionsRoute = (): JSX.Element => <ChooseSession route={sessionsRoute} />;

export const sessionsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "sessions",
  component: SessionsRoute,
});
