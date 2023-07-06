import { Route } from "@tanstack/router";

import { sessionsRoute } from "@/routes/sessions";
import { Edit } from "@/components";

const SessionIdRoute = (): JSX.Element => <Edit route={sessionIdRoute} />;

export const sessionIdRoute = new Route({
  getParentRoute: () => sessionsRoute,
  path: "$sessionId",
  component: SessionIdRoute,
});
