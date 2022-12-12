import type { MouseEventHandler } from "react";

import { SessionsNavBar, SimplePaginationBar, SessionList } from "@/components";
import type { SessionMeta, Account } from "@/Types";

import "@/index.css";

export interface SessionsPageProps {
  /**
   * The account whose sessions will be displayed.
   *
   * @type {Account}
   */
  account: Account;

  /**
   * The list of session metadata displayed on this page.
   *
   * @type {SessionMeta[]}
   */
  sessions: SessionMeta[];

  /**
   * The event handler for the "New program" button.
   *
   * @type {MouseEventHandler<unknown> | undefined}
   */
  onClickNewProgram: MouseEventHandler<unknown> | undefined;

  /**
   * The 1-based index of the first item shown on this page.
   *
   * @type {number}
   */
  startIndex: number;

  /**
   * The number of items displayed on this page.
   *
   * @type {number}
   */
  numItems: number;

  /**
   * The total number of items.
   *
   * @type {number}
   */
  totalItems: number;

  /**
   * The event handler for the "next page" button, if there is one.
   *
   * @type {MouseEventHandler<unknown> | undefined}
   */
  onClickNextPage: MouseEventHandler<unknown> | undefined;

  /**
   * The event handler for the "previous page" button, if there is one.
   *
   * @type {MouseEventHandler<unknown> | undefined}
   */
  onClickPreviousPage: MouseEventHandler<unknown> | undefined;

  onClickDelete: (id: string) => void;
}

export const SessionsPage = (p: SessionsPageProps): JSX.Element => (
  <div className="relative grid h-screen grid-cols-1 grid-rows-[auto,1fr] overflow-hidden">
    <div className="mx-1 lg:mx-4">
      <SessionsNavBar
        onClickNewProgram={p.onClickNewProgram}
        account={p.account}
      />
    </div>
    <div className="max-h-screen overflow-auto rounded-sm bg-grey-primary p-3 shadow-inner">
      <SessionList sessions={p.sessions} onClickDelete={p.onClickDelete} />
    </div>
    <div className="mx-1 lg:mx-4">
      <SimplePaginationBar
        itemNamePlural="sessions"
        startIndex={p.startIndex}
        numItems={p.sessions.length}
        totalItems={p.totalItems}
        onClickNextPage={p.onClickNextPage}
        onClickPreviousPage={p.onClickPreviousPage}
      />
    </div>
  </div>
);

export default SessionsPage;
