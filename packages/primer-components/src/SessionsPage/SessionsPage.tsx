import "@/index.css";

import { SessionsNavBar } from "@/SessionsNavBar/SessionsNavBar";
import type { SessionMeta, Account } from "@hackworthltd/primer-types";
import { SessionList } from "@/SessionList/SessionList";

export interface SessionsPageProps {
  /**
   * The account whose sessions will be displayed.
   *
   * @type {Account}
   */
  account: Account;

  /**
   * The list of the account's sessions.
   *
   *
   * @type {SessionMeta[]}
   */
  sessions: SessionMeta[];
}

export const SessionsPage = (p: SessionsPageProps): JSX.Element => (
  <div className="grid overflow-hidden h-screen grid-cols-1 grid-rows-[auto,1fr]">
    <div className="mx-1 lg:mx-4">
      <SessionsNavBar account={p.account} />
    </div>
    <div className="mx-1 lg:mx-4 max-h-screen overflow-auto">
      <SessionList sessions={p.sessions} />
    </div>
  </div>
);
