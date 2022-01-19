import type { MouseEventHandler } from "react";

import { SessionsNavBar } from "@/SessionsNavBar/SessionsNavBar";
import type { SessionMeta, Account } from "@hackworthltd/primer-types";
import { SessionList } from "@/SessionList/SessionList";

import "@/index.css";

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
   * @type {SessionMeta[]}
   */
  sessions: SessionMeta[];

  /**
   * The 1-based index of the first session shown on this page.
   *
   * @type {Number}
   */
  startIndex: Number;

  /**
   * The total number of sessions.
   *
   * @type {Number}
   */
  numSessions: Number;

  /**
   * The event handler for the "next page" button, if there is one.
   *
   * @type {MouseEventHandler<unknown>}
   */
  onClickNextPage?: MouseEventHandler<unknown>;

  /**
   * The event handler for the "previous page" button, if there is one.
   *
   * @type {MouseEventHandler<unknown>}
   */
  onClickPreviousPage?: MouseEventHandler<unknown>;

  /**
   * The event handler for the "New program" button.
   *
   * @type {MouseEventHandler<unknown> | undefined}
   */
  onClickNewProgram: MouseEventHandler<unknown> | undefined;
}

export const SessionsPage = (p: SessionsPageProps): JSX.Element => (
  <div className="grid overflow-hidden grid-cols-1 grid-rows-[auto,1fr] h-screen">
    <div className="mx-1 lg:mx-4">
      <SessionsNavBar onClickNewProgram={p.onClickNewProgram} account={p.account} />
    </div>
    <div className="overflow-auto mx-1 lg:mx-4 max-h-screen">
      <SessionList sessions={p.sessions} />
    </div>
  </div>
);
