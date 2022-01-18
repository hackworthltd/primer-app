import { useState } from "react";
import type { SessionMeta } from "@hackworthltd/primer-types";
import { exampleAccount, SessionsPage } from "@hackworthltd/primer-components";
import type { Session } from "@/primer-api";
import { useGetSessionList, GetSessionListParams } from "@/primer-api";

import "@hackworthltd/primer-components/style.css";

const App = (): JSX.Element => {
  // NOTE: pagination in our API is 1-indexed.
  const [page] = useState(1);

  // XXX dhess: the default page size of 4 is chosen here just to
  // exercise the UI a bit. We should almost certainly make the
  // default value larger, and potentially set it based on the
  // device's viewport size.
  const [pageSize] = useState(4);

  const params: GetSessionListParams = { page: page, pageSize: pageSize };
  const { data } = useGetSessionList(params);

  // Backend sessions do not yet have `lastModified`, so we just
  // create one on the fly for each retrieved session.
  const sessions: Session[] = data? data.items : [];
  const sessionsMeta: SessionMeta[] = sessions.map((session: Session) => ({ name: session.name, id: session.id, lastModified: new Date() }));

  return <SessionsPage account={exampleAccount} sessions={sessionsMeta} />;
};

export default App;
