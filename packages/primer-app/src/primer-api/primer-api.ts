/**
 * Generated by orval v6.8.1 🍺
 * Do not edit manually.
 * Primer backend API
 * A backend service implementing a pedagogic functional programming language.
 * OpenAPI spec version: 0.7
 */
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  QueryFunction,
  MutationFunction,
  UseQueryResult,
  QueryKey,
} from "react-query";
import type {
  Prog,
  GetApiProgramParams,
  PaginatedSession,
  GetSessionListParams,
  Uuid,
} from "./model";
import { useCustomInstance, ErrorType } from "./mutator/use-custom-instance";

type AwaitedInput<T> = PromiseLike<T> | T;

type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;

export const useGetApiProgramHook = () => {
  const getApiProgram = useCustomInstance<Prog>();

  return (params?: GetApiProgramParams, signal?: AbortSignal) => {
    return getApiProgram({
      url: `/api/program`,
      method: "get",
      signal,
      params,
    });
  };
};

export const getGetApiProgramQueryKey = (params?: GetApiProgramParams) => [
  `/api/program`,
  ...(params ? [params] : []),
];

export type GetApiProgramQueryResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useGetApiProgramHook>>>
>;
export type GetApiProgramQueryError = ErrorType<void>;

export const useGetApiProgram = <
  TData = Awaited<ReturnType<ReturnType<typeof useGetApiProgramHook>>>,
  TError = ErrorType<void>
>(
  params?: GetApiProgramParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<ReturnType<typeof useGetApiProgramHook>>>,
      TError,
      TData
    >;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetApiProgramQueryKey(params);

  const getApiProgram = useGetApiProgramHook();

  const queryFn: QueryFunction<
    Awaited<ReturnType<ReturnType<typeof useGetApiProgramHook>>>
  > = ({ signal }) => getApiProgram(params, signal);

  const query = useQuery<
    Awaited<ReturnType<ReturnType<typeof useGetApiProgramHook>>>,
    TError,
    TData
  >(queryKey, queryFn, queryOptions);

  return {
    queryKey,
    ...query,
  };
};

/**
 * @summary List sessions
 */
export const useGetSessionListHook = () => {
  const getSessionList = useCustomInstance<PaginatedSession>();

  return (params?: GetSessionListParams, signal?: AbortSignal) => {
    return getSessionList({
      url: `/api/sessions`,
      method: "get",
      signal,
      params,
    });
  };
};

export const getGetSessionListQueryKey = (params?: GetSessionListParams) => [
  `/api/sessions`,
  ...(params ? [params] : []),
];

export type GetSessionListQueryResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useGetSessionListHook>>>
>;
export type GetSessionListQueryError = ErrorType<void>;

export const useGetSessionList = <
  TData = Awaited<ReturnType<ReturnType<typeof useGetSessionListHook>>>,
  TError = ErrorType<void>
>(
  params?: GetSessionListParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<ReturnType<typeof useGetSessionListHook>>>,
      TError,
      TData
    >;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetSessionListQueryKey(params);

  const getSessionList = useGetSessionListHook();

  const queryFn: QueryFunction<
    Awaited<ReturnType<ReturnType<typeof useGetSessionListHook>>>
  > = ({ signal }) => getSessionList(params, signal);

  const query = useQuery<
    Awaited<ReturnType<ReturnType<typeof useGetSessionListHook>>>,
    TError,
    TData
  >(queryKey, queryFn, queryOptions);

  return {
    queryKey,
    ...query,
  };
};

/**
 * @summary Create a new session
 */
export const useCreateSessionHook = () => {
  const createSession = useCustomInstance<Uuid>();

  return () => {
    return createSession({ url: `/api/sessions`, method: "post" });
  };
};

export type CreateSessionMutationResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useCreateSessionHook>>>
>;

export type CreateSessionMutationError = ErrorType<unknown>;

export const useCreateSession = <
  TError = ErrorType<unknown>,
  TVariables = void,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof useCreateSessionHook>>>,
    TError,
    TVariables,
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const createSession = useCreateSessionHook();

  const mutationFn: MutationFunction<
    Awaited<ReturnType<ReturnType<typeof useCreateSessionHook>>>,
    TVariables
  > = () => {
    return createSession();
  };

  return useMutation<
    Awaited<ReturnType<typeof createSession>>,
    TError,
    TVariables,
    TContext
  >(mutationFn, mutationOptions);
};
