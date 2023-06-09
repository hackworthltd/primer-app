import { useState } from "react";
import type { MouseEventHandler } from "react";

import {
  SessionsNavBar,
  SimplePaginationBar,
  SessionList,
  SessionNameModal,
} from "@/components";
import type { SessionMeta, Account } from "@/Types";
import type { Uuid } from "@/primer-api";

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
   */
  onClickNewProgram: (name: string, importPrelude: boolean) => void;

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

  /**
   * The event handler for deleting the given session, identified by its ID.
   *
   * @type {(id: Uuid) => void}
   */

  onClickDelete: (id: Uuid) => void;

  /**
   * The search bar's onChange handler.
   */
  onChangeSearch: (searchString: string) => void;

  /**
   * The search bar's onSubmit handler.
   */
  onSubmitSearch: (searchString: string) => void;
}

export const SessionsPage = (p: SessionsPageProps): JSX.Element => {
  const [importPrelude, setImportPrelude] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const onClickNewProgram = (): void => {
    setShowModal(true);
  };

  return (
    <div className="relative grid h-screen grid-cols-1 grid-rows-[auto,1fr] overflow-hidden">
      <div className="relative z-40 px-1 shadow-md lg:px-4">
        <SessionsNavBar
          onClickNewProgram={onClickNewProgram}
          account={p.account}
          onSubmitSearch={p.onSubmitSearch}
          onChangeSearch={p.onChangeSearch}
        />
      </div>
      <div className="max-h-screen overflow-auto rounded-sm bg-grey-primary p-3 shadow-inner">
        <SessionList sessions={p.sessions} onClickDelete={p.onClickDelete} />
      </div>
      <div className="relative z-40 px-1 shadow-2xl lg:px-4">
        <SimplePaginationBar
          itemNamePlural="sessions"
          startIndex={p.startIndex}
          numItems={p.sessions.length}
          totalItems={p.totalItems}
          onClickNextPage={p.onClickNextPage}
          onClickPreviousPage={p.onClickPreviousPage}
        />
      </div>
      <SessionNameModal
        open={showModal}
        importPrelude={importPrelude}
        onClose={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
        onSubmit={(name: string, _importPrelude: boolean) => {
          // Remember the student's choice of whether or not to import the Prelude.
          setImportPrelude(_importPrelude);
          p.onClickNewProgram(name, _importPrelude);
        }}
      />
    </div>
  );
};

export default SessionsPage;
