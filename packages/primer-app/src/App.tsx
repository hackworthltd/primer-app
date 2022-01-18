import type { SessionMeta } from "@hackworthltd/primer-types";
import { exampleAccount, SessionsPage } from "@hackworthltd/primer-components";
import "@hackworthltd/primer-components/style.css";
import type { Session } from "@/primer-api";
import { useGetSessionList } from "@/primer-api";

const App = (): JSX.Element => {
  const { data: page } = useGetSessionList();

  // Backend sessions do not yet have `lastModified`, so we just create one on the fly.
  const sessions: Session[] = page? page.items : [];
  const sessionsMeta: SessionMeta[] = sessions.map((session: Session) => ({ name: session.name, id: session.id, lastModified: new Date() }));

  return <SessionsPage account={exampleAccount} sessions={sessionsMeta} />;
};

export default App;
