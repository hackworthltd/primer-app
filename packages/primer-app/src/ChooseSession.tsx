import type { MouseEventHandler } from "react";
import { useState } from "react";
import { exampleAccount, SessionsPage } from "@hackworthltd/primer-components";
import type {
  SessionMeta,
  GetSessionListParams,
  PaginatedMeta,
  Session,
} from "@hackworthltd/primer-types";
import { useGetSessionList } from "@hackworthltd/primer-types";

import "@hackworthltd/primer-components/style.css";

const ChooseSession = (): JSX.Element => {
  // NOTE: pagination in our API is 1-indexed.
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  const params: GetSessionListParams = { page: page, pageSize: pageSize };
  const { data } = useGetSessionList(params);

  // Backend sessions do not yet have `lastModified`, so we just
  // create one on the fly for each retrieved session.
  const sessions: Session[] = data ? data.items : [];
  const sessionsMeta: SessionMeta[] = sessions.map((session: Session) => ({
    name: session.name,
    id: session.id,
    lastModified: new Date(),
  }));

  const meta: PaginatedMeta = data
    ? data.meta
    : { totalItems: 0, pageSize: 1, thisPage: 1, firstPage: 1, lastPage: 1 };
  const startIndex: number = (meta.thisPage - 1) * meta.pageSize + 1;

  const onClickNextPage: MouseEventHandler<unknown> | undefined =
    meta.thisPage < meta.lastPage ? () => setPage(page + 1) : undefined;
  const onClickPreviousPage: MouseEventHandler<unknown> | undefined =
    meta.thisPage > 1 ? () => setPage(page - 1) : undefined;

  return (
    <SessionsPage
      account={exampleAccount}
      sessions={sessionsMeta}
      startIndex={startIndex}
      numItems={meta.pageSize}
      totalItems={meta.totalItems}
      onClickNewProgram={undefined}
      onClickNextPage={onClickNextPage}
      onClickPreviousPage={onClickPreviousPage}
    />
  );
};

export default ChooseSession;
