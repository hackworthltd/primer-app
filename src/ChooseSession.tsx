import type { MouseEventHandler } from "react";
import { useState } from "react";
import type { SessionMeta } from "@/Types";
import { exampleAccount, SessionsPage } from "@/components";
import type {
  GetSessionListParams,
  PaginatedMeta,
  Session,
  Uuid,
} from "@/primer-api";
import {
  useGetSessionList,
  useCreateSession,
  getGetSessionListQueryKey,
  useDeleteSession,
} from "@/primer-api";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const ChooseSession = (): JSX.Element => {
  // NOTE: pagination in our API is 1-indexed.
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const queryClient = useQueryClient();
  const deleteSession = useDeleteSession({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries(getGetSessionListQueryKey());
      },
    },
  });

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

  // If we're on the last page of results, and the student deletes the last
  // session on that page; or if we somehow request a page beyond the last page
  // of results; then the API will return an empty list of sessions, and the
  // last page will be less than the current page. When this happens, it means
  // we've gone beyond the last page of results, and therefore we want to fetch
  // the new last page.
  //
  // Note that when there are no sessions at all, then the current page and the
  // last page will both be 1, and therefore we can be sure that we won't do
  // this ad infinitum.
  if (sessions.length == 0 && meta.thisPage > meta.lastPage) {
    setPage(meta.lastPage);
  }

  const navigate = useNavigate();
  const newSession = useCreateSession({
    mutation: {
      onSuccess: (newSessionID: Uuid) => navigate(`/sessions/${newSessionID}`),
    },
  });

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
      onClickNewProgram={(name: string) =>
        newSession.mutate({ data: { name: name } })
      }
      onClickNextPage={onClickNextPage}
      onClickPreviousPage={onClickPreviousPage}
      onClickDelete={(sessionId) => deleteSession.mutate({ sessionId })}
    />
  );
};

export default ChooseSession;
