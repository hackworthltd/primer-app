import type { MouseEventHandler } from "react";
import { useState } from "react";
import type { SessionMeta } from "@/Types";
import { exampleAccount, SessionsPage } from "@/components";
import type {
  GetSessionListParams,
  PaginatedMeta,
  Session,
} from "@/primer-api";
import { useGetSessionList } from "@/primer-api";

const ChooseSession = (): JSX.Element => {
  // NOTE: pagination in our API is 1-indexed.
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  const params: GetSessionListParams = { page: page, pageSize: pageSize };
  const { data } = useGetSessionList(params);

  const sessions: Session[] = data ? data.items : [];
  const sessionsMeta: SessionMeta[] = sessions.map((session: Session) => ({
    name: session.name,
    id: session.id,
    lastModified: session.lastModified,
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
