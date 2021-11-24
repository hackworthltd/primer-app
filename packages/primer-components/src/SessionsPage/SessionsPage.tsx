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
};

export const SessionsPage = (p: SessionsPageProps): JSX.Element => (
  <div className="container flex flex-col">
    <SessionsNavBar account={p.account} />
    <SessionList sessions={p.sessions} />
  </div>
);
