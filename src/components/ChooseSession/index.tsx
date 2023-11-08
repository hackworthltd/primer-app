import { useState } from "react";
import { useCookies } from "react-cookie";
import {
  ExclamationCircleIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";
import {
  exampleAccount,
  SessionList,
  SessionNameModal,
  SessionsNavBar,
  SimplePaginationBar,
  Spinner,
} from "@/components";
import type { Uuid } from "@/primer-api";
import {
  useGetSessionList,
  useCreateSession,
  getGetSessionListQueryKey,
  useDeleteSession,
} from "@/primer-api";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const ChooseSession = (): JSX.Element => {
  const [cookies] = useCookies(["id"]);

  const [importPrelude, setImportPrelude] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const onClickNewProgram = (): void => {
    setShowModal(true);
  };

  // NOTE: pagination in our API is 1-indexed.
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [sessionNameFilter, setSessionNameFilter] = useState("");

  const queryClient = useQueryClient();
  const deleteSession = useDeleteSession({
    mutation: {
      onSuccess: () =>
        queryClient.invalidateQueries(getGetSessionListQueryKey()),
    },
  });

  const navigate = useNavigate();
  const newSession = useCreateSession({
    mutation: {
      onSuccess: (newSessionID: Uuid) => {
        queryClient.invalidateQueries(getGetSessionListQueryKey());
        navigate(`/sessions/${newSessionID}`);
      },
    },
  });

  const { isError, data, error } = useGetSessionList(
    {
      page,
      pageSize,
      nameLike: sessionNameFilter,
    },
    {
      query: {
        onSuccess: (data) => {
          // If we're on the last page of results, and the student deletes the
          // last session on that page; or if we somehow request a page beyond
          // the last page of results; then the API will return an empty list of
          // sessions, and the last page will be less than the current page. When
          // this happens, it means we've gone beyond the last page of results,
          // and therefore we want to fetch the new last page.
          //
          // Note that when there are no sessions at all, then the current page
          // and the last page will both be 1, and therefore we can be sure that
          // we won't do this ad infinitum.
          if (
            data.items.length == 0 &&
            data.meta.thisPage > data.meta.lastPage
          ) {
            setPage(data.meta.lastPage);
          }
        },
      },
    }
  );

  // Note that we show data if it's available, regardless of the status of
  // `isLoading` or `isError`. This means we may show stale data, but we prefer
  // this over showing a loading message or an error for short server outages.
  // See:
  //
  // https://tkdodo.eu/blog/status-checks-in-react-query
  //
  // Note that React Query will not show stale data indefinitely, and will
  // eventually show an error message if the data is stale for too long.

  return (
    <div className="relative grid h-[100dvh] grid-cols-1 grid-rows-[auto,1fr] overflow-hidden">
      <div className="relative z-40 px-1 shadow-md lg:px-4">
        <SessionsNavBar
          onClickNewProgram={onClickNewProgram}
          account={{ ...exampleAccount, id: cookies.id }}
          onSubmitSearch={(nameFilter: string) => {
            // Unlike `onChangeSearch`, this callback is always triggered
            // by an explicit action, and never by, e.g., a page refresh,
            // so we always want to reset the page when this callback is
            // invoked.
            setSessionNameFilter(nameFilter);
            setPage(1);
          }}
          onChangeSearch={(nameFilter: string) => {
            // For technical reasons, this callback may be triggered even
            // if the value of the search term didn't actually change
            // (e.g., because the page is redrawn), and in these cases, we
            // don't want to update the page, so we filter these spurious
            // "changes" out.
            if (nameFilter != sessionNameFilter) {
              setSessionNameFilter(nameFilter);
              setPage(1);
            }
          }}
        />
      </div>
      <div className="max-h-screen overflow-auto rounded-sm bg-grey-primary p-3 shadow-inner">
        {data && data.items.length > 0 ? (
          <SessionList
            sessions={data.items}
            onClickDelete={(sessionId) => deleteSession.mutate({ sessionId })}
          />
        ) : data && sessionNameFilter != "" ? (
          <div className="flex min-h-full flex-col items-center justify-center">
            <FaceFrownIcon
              className="mx-auto h-8 w-8 text-blue-primary"
              aria-hidden="true"
            />
            <p className="mt-4 text-lg font-semibold leading-6 text-blue-secondary">
              No results found
            </p>
            <p className="mt-2 block text-center text-sm leading-6 text-blue-primary">
              No programs found with that name. Please try a different name, or
              create a new program.
            </p>
          </div>
        ) : data ? (
          <div className="flex min-h-full flex-col items-center justify-center">
            <p className="mt-4 text-lg font-semibold leading-6 text-blue-secondary">
              No programs found
            </p>
            <p className="mt-2 block text-center text-sm leading-6 text-blue-primary">
              You don&apos;t have any programs yet. Create a new one!
            </p>
          </div>
        ) : isError ? (
          <div className="flex min-h-full flex-col items-center justify-center">
            <ExclamationCircleIcon
              className="mx-auto h-8 w-8 text-red-secondary"
              aria-hidden="true"
            />
            <p className="mt-4 text-lg font-semibold leading-6 text-red-primary">
              There was an error while fetching your programs:
            </p>
            <p className="mt-2 block text-sm leading-6 text-red-primary">
              {error.message}
            </p>
          </div>
        ) : (
          <div className="flex min-h-full flex-col items-center justify-center">
            <Spinner aria-label="Loading…" />
          </div>
        )}
      </div>
      <div className="relative z-40 px-1 shadow-2xl lg:px-4">
        {data && (
          <SimplePaginationBar
            itemNamePlural="sessions"
            startIndex={(data.meta.thisPage - 1) * data.meta.pageSize + 1}
            numItems={data.items.length}
            totalItems={data.meta.totalItems}
            onClickNextPage={
              data.meta.thisPage < data.meta.lastPage
                ? () => setPage(page + 1)
                : undefined
            }
            onClickPreviousPage={
              data.meta.thisPage > 1 ? () => setPage(page - 1) : undefined
            }
          />
        )}
      </div>
      <SessionNameModal
        open={showModal}
        importPrelude={importPrelude}
        onClose={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
        onSubmit={(name: string, _importPrelude: boolean) => {
          // Remember the student's choice of whether or not to import the Prelude.
          setImportPrelude(_importPrelude);
          newSession.mutate({
            data: { name, importPrelude: _importPrelude },
          });
        }}
      />
    </div>
  );
};

export default ChooseSession;
