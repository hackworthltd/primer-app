/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Primer backend API
 * A backend service implementing a pedagogic functional programming language.
 * OpenAPI spec version: 0.7
 */
import { useQuery, useMutation } from "@tanstack/react-query";
import type {
  UseQueryOptions,
  UseMutationOptions,
  QueryFunction,
  MutationFunction,
  UseQueryResult,
  QueryKey,
} from "@tanstack/react-query";
import type {
  Uuid,
  PaginatedSession,
  GetSessionListParams,
  Prog,
  ApplyActionBody,
  ApplyActionWithInputParams,
  Selection,
  ApplyActionParams,
  Action,
  GetAvailableActionsParams,
  Options,
  GetActionOptionsParams,
  CreateDefinitionParams,
  EvalFullResp,
  GlobalName,
  EvalFullParams,
  GetProgramParams,
} from "./model";
import { useCustomInstance } from "./mutator/use-custom-instance";
import type { ErrorType } from "./mutator/use-custom-instance";

/**
 * Copy the session whose ID is given in the request body to a new session, and return the new session's ID. Note that this method can be called at any time and is not part of the session-specific API, as it's not scoped by the current session ID like those methods are.
 * @summary Copy a session to a new session
 */
export const useCopySessionHook = () => {
  const copySession = useCustomInstance<Uuid>();

  return (uuid: Uuid) => {
    return copySession({
      url: `/openapi/copy-session`,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      data: uuid,
    });
  };
};

export type CopySessionMutationResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useCopySessionHook>>>
>;
export type CopySessionMutationBody = Uuid;
export type CopySessionMutationError = ErrorType<void>;

export const useCopySession = <
  TError = ErrorType<void>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof useCopySessionHook>>>,
    TError,
    { data: Uuid },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const copySession = useCopySessionHook();

  const mutationFn: MutationFunction<
    Awaited<ReturnType<ReturnType<typeof useCopySessionHook>>>,
    { data: Uuid }
  > = (props) => {
    const { data } = props ?? {};

    return copySession(data);
  };

  return useMutation<
    Awaited<ReturnType<typeof copySession>>,
    TError,
    { data: Uuid },
    TContext
  >(mutationFn, mutationOptions);
};

/**
 * Get a list of all sessions and their human-readable names. By default, this method returns the list of all sessions in the persistent database, but optionally it can return just the list of all sessions in memory, which is mainly useful for testing. Note that in a production system, this endpoint should obviously be authentication-scoped and only return the list of sessions that the caller is authorized to see.
 * @summary Get the list of sessions
 */
export const useGetSessionListHook = () => {
  const getSessionList = useCustomInstance<PaginatedSession>();

  return (params?: GetSessionListParams, signal?: AbortSignal) => {
    return getSessionList({
      url: `/openapi/sessions`,
      method: "get",
      params,
      ...(signal ? { signal } : {}),
    });
  };
};

export const getGetSessionListQueryKey = (params?: GetSessionListParams) => [
  `/openapi/sessions`,
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
  >(queryKey, queryFn, { cacheTime: 0, ...queryOptions }) as UseQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary Create a new session and return its ID
 */
export const useCreateSessionHook = () => {
  const createSession = useCustomInstance<Uuid>();

  return () => {
    return createSession({ url: `/openapi/sessions`, method: "post" });
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

/**
 * @summary Delete the specified session
 */
export const useDeleteSessionHook = () => {
  const deleteSession = useCustomInstance<void>();

  return (sessionId: string) => {
    return deleteSession({
      url: `/openapi/sessions/${sessionId}`,
      method: "delete",
    });
  };
};

export type DeleteSessionMutationResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useDeleteSessionHook>>>
>;

export type DeleteSessionMutationError = ErrorType<unknown>;

export const useDeleteSession = <
  TError = ErrorType<unknown>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof useDeleteSessionHook>>>,
    TError,
    { sessionId: string },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const deleteSession = useDeleteSessionHook();

  const mutationFn: MutationFunction<
    Awaited<ReturnType<ReturnType<typeof useDeleteSessionHook>>>,
    { sessionId: string }
  > = (props) => {
    const { sessionId } = props ?? {};

    return deleteSession(sessionId);
  };

  return useMutation<
    Awaited<ReturnType<typeof deleteSession>>,
    TError,
    { sessionId: string },
    TContext
  >(mutationFn, mutationOptions);
};

/**
 * @summary Apply an action with some additional input
 */
export const useApplyActionWithInputHook = () => {
  const applyActionWithInput = useCustomInstance<Prog>();

  return (
    sessionId: string,
    applyActionBody: ApplyActionBody,
    params: ApplyActionWithInputParams
  ) => {
    return applyActionWithInput({
      url: `/openapi/sessions/${sessionId}/action/apply/input`,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      data: applyActionBody,
      params,
    });
  };
};

export type ApplyActionWithInputMutationResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useApplyActionWithInputHook>>>
>;
export type ApplyActionWithInputMutationBody = ApplyActionBody;
export type ApplyActionWithInputMutationError = ErrorType<void>;

export const useApplyActionWithInput = <
  TError = ErrorType<void>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof useApplyActionWithInputHook>>>,
    TError,
    {
      sessionId: string;
      data: ApplyActionBody;
      params: ApplyActionWithInputParams;
    },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const applyActionWithInput = useApplyActionWithInputHook();

  const mutationFn: MutationFunction<
    Awaited<ReturnType<ReturnType<typeof useApplyActionWithInputHook>>>,
    {
      sessionId: string;
      data: ApplyActionBody;
      params: ApplyActionWithInputParams;
    }
  > = (props) => {
    const { sessionId, data, params } = props ?? {};

    return applyActionWithInput(sessionId, data, params);
  };

  return useMutation<
    Awaited<ReturnType<typeof applyActionWithInput>>,
    TError,
    {
      sessionId: string;
      data: ApplyActionBody;
      params: ApplyActionWithInputParams;
    },
    TContext
  >(mutationFn, mutationOptions);
};

/**
 * @summary Apply a simple action i.e. one which requires no further input
 */
export const useApplyActionHook = () => {
  const applyAction = useCustomInstance<Prog>();

  return (
    sessionId: string,
    selection: Selection,
    params: ApplyActionParams
  ) => {
    return applyAction({
      url: `/openapi/sessions/${sessionId}/action/apply/simple`,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      data: selection,
      params,
    });
  };
};

export type ApplyActionMutationResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useApplyActionHook>>>
>;
export type ApplyActionMutationBody = Selection;
export type ApplyActionMutationError = ErrorType<void>;

export const useApplyAction = <
  TError = ErrorType<void>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof useApplyActionHook>>>,
    TError,
    { sessionId: string; data: Selection; params: ApplyActionParams },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const applyAction = useApplyActionHook();

  const mutationFn: MutationFunction<
    Awaited<ReturnType<ReturnType<typeof useApplyActionHook>>>,
    { sessionId: string; data: Selection; params: ApplyActionParams }
  > = (props) => {
    const { sessionId, data, params } = props ?? {};

    return applyAction(sessionId, data, params);
  };

  return useMutation<
    Awaited<ReturnType<typeof applyAction>>,
    TError,
    { sessionId: string; data: Selection; params: ApplyActionParams },
    TContext
  >(mutationFn, mutationOptions);
};

/**
 * @summary Get available actions for the definition, or a node within it, sorted by priority
 */
export const useGetAvailableActionsHook = () => {
  const getAvailableActions = useCustomInstance<Action[]>();

  return (
    sessionId: string,
    selection: Selection,
    params: GetAvailableActionsParams
  ) => {
    return getAvailableActions({
      url: `/openapi/sessions/${sessionId}/action/available`,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      data: selection,
      params,
    });
  };
};

export const getGetAvailableActionsQueryKey = (
  sessionId: string,
  selection: Selection,
  params: GetAvailableActionsParams
) => [
  `/openapi/sessions/${sessionId}/action/available`,
  ...(params ? [params] : []),
  selection,
];

export type GetAvailableActionsQueryResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useGetAvailableActionsHook>>>
>;
export type GetAvailableActionsQueryError = ErrorType<void>;

export const useGetAvailableActions = <
  TData = Awaited<ReturnType<ReturnType<typeof useGetAvailableActionsHook>>>,
  TError = ErrorType<void>
>(
  sessionId: string,
  selection: Selection,
  params: GetAvailableActionsParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<ReturnType<typeof useGetAvailableActionsHook>>>,
      TError,
      TData
    >;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getGetAvailableActionsQueryKey(sessionId, selection, params);

  const getAvailableActions = useGetAvailableActionsHook();

  const queryFn: QueryFunction<
    Awaited<ReturnType<ReturnType<typeof useGetAvailableActionsHook>>>
  > = () => getAvailableActions(sessionId, selection, params);

  const query = useQuery<
    Awaited<ReturnType<ReturnType<typeof useGetAvailableActionsHook>>>,
    TError,
    TData
  >(queryKey, queryFn, {
    enabled: !!sessionId,
    ...queryOptions,
  }) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary Get the input options for an action
 */
export const useGetActionOptionsHook = () => {
  const getActionOptions = useCustomInstance<Options>();

  return (
    sessionId: string,
    selection: Selection,
    params: GetActionOptionsParams
  ) => {
    return getActionOptions({
      url: `/openapi/sessions/${sessionId}/action/options`,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      data: selection,
      params,
    });
  };
};

export type GetActionOptionsMutationResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useGetActionOptionsHook>>>
>;
export type GetActionOptionsMutationBody = Selection;
export type GetActionOptionsMutationError = ErrorType<void>;

export const useGetActionOptions = <
  TError = ErrorType<void>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof useGetActionOptionsHook>>>,
    TError,
    { sessionId: string; data: Selection; params: GetActionOptionsParams },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const getActionOptions = useGetActionOptionsHook();

  const mutationFn: MutationFunction<
    Awaited<ReturnType<ReturnType<typeof useGetActionOptionsHook>>>,
    { sessionId: string; data: Selection; params: GetActionOptionsParams }
  > = (props) => {
    const { sessionId, data, params } = props ?? {};

    return getActionOptions(sessionId, data, params);
  };

  return useMutation<
    Awaited<ReturnType<typeof getActionOptions>>,
    TError,
    { sessionId: string; data: Selection; params: GetActionOptionsParams },
    TContext
  >(mutationFn, mutationOptions);
};

/**
 * @summary Create a new definition
 */
export const useCreateDefinitionHook = () => {
  const createDefinition = useCustomInstance<Prog>();

  return (
    sessionId: string,
    createDefinitionBody: string[],
    params?: CreateDefinitionParams
  ) => {
    return createDefinition({
      url: `/openapi/sessions/${sessionId}/def`,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      data: createDefinitionBody,
      params,
    });
  };
};

export type CreateDefinitionMutationResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useCreateDefinitionHook>>>
>;
export type CreateDefinitionMutationBody = string[];
export type CreateDefinitionMutationError = ErrorType<void>;

export const useCreateDefinition = <
  TError = ErrorType<void>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof useCreateDefinitionHook>>>,
    TError,
    { sessionId: string; data: string[]; params?: CreateDefinitionParams },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const createDefinition = useCreateDefinitionHook();

  const mutationFn: MutationFunction<
    Awaited<ReturnType<ReturnType<typeof useCreateDefinitionHook>>>,
    { sessionId: string; data: string[]; params?: CreateDefinitionParams }
  > = (props) => {
    const { sessionId, data, params } = props ?? {};

    return createDefinition(sessionId, data, params);
  };

  return useMutation<
    Awaited<ReturnType<typeof createDefinition>>,
    TError,
    { sessionId: string; data: string[]; params?: CreateDefinitionParams },
    TContext
  >(mutationFn, mutationOptions);
};

/**
 * @summary Evaluate the named definition to normal form (or time out)
 */
export const useEvalFullHook = () => {
  const evalFull = useCustomInstance<EvalFullResp>();

  return (
    sessionId: string,
    globalName: GlobalName,
    params?: EvalFullParams
  ) => {
    return evalFull({
      url: `/openapi/sessions/${sessionId}/eval`,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      data: globalName,
      params,
    });
  };
};

export type EvalFullMutationResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useEvalFullHook>>>
>;
export type EvalFullMutationBody = GlobalName;
export type EvalFullMutationError = ErrorType<void>;

export const useEvalFull = <
  TError = ErrorType<void>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof useEvalFullHook>>>,
    TError,
    { sessionId: string; data: GlobalName; params?: EvalFullParams },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const evalFull = useEvalFullHook();

  const mutationFn: MutationFunction<
    Awaited<ReturnType<ReturnType<typeof useEvalFullHook>>>,
    { sessionId: string; data: GlobalName; params?: EvalFullParams }
  > = (props) => {
    const { sessionId, data, params } = props ?? {};

    return evalFull(sessionId, data, params);
  };

  return useMutation<
    Awaited<ReturnType<typeof evalFull>>,
    TError,
    { sessionId: string; data: GlobalName; params?: EvalFullParams },
    TContext
  >(mutationFn, mutationOptions);
};

/**
 * @summary Get the specified session's name
 */
export const useGetSessionNameHook = () => {
  const getSessionName = useCustomInstance<string>();

  return (sessionId: string, signal?: AbortSignal) => {
    return getSessionName({
      url: `/openapi/sessions/${sessionId}/name`,
      method: "get",
      ...(signal ? { signal } : {}),
    });
  };
};

export const getGetSessionNameQueryKey = (sessionId: string) => [
  `/openapi/sessions/${sessionId}/name`,
];

export type GetSessionNameQueryResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useGetSessionNameHook>>>
>;
export type GetSessionNameQueryError = ErrorType<void>;

export const useGetSessionName = <
  TData = Awaited<ReturnType<ReturnType<typeof useGetSessionNameHook>>>,
  TError = ErrorType<void>
>(
  sessionId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<ReturnType<typeof useGetSessionNameHook>>>,
      TError,
      TData
    >;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetSessionNameQueryKey(sessionId);

  const getSessionName = useGetSessionNameHook();

  const queryFn: QueryFunction<
    Awaited<ReturnType<ReturnType<typeof useGetSessionNameHook>>>
  > = ({ signal }) => getSessionName(sessionId, signal);

  const query = useQuery<
    Awaited<ReturnType<ReturnType<typeof useGetSessionNameHook>>>,
    TError,
    TData
  >(queryKey, queryFn, {
    enabled: !!sessionId,
    cacheTime: 0,
    ...queryOptions,
  }) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * Attempt to set the current session name. Returns the actual new session name. (Note that this may differ from the name provided.)
 * @summary Set the specified session's name
 */
export const useSetSessionNameHook = () => {
  const setSessionName = useCustomInstance<string>();

  return (sessionId: string, setSessionNameBody: string) => {
    return setSessionName({
      url: `/openapi/sessions/${sessionId}/name`,
      method: "put",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      data: setSessionNameBody,
    });
  };
};

export type SetSessionNameMutationResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useSetSessionNameHook>>>
>;
export type SetSessionNameMutationBody = string;
export type SetSessionNameMutationError = ErrorType<void>;

export const useSetSessionName = <
  TError = ErrorType<void>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof useSetSessionNameHook>>>,
    TError,
    { sessionId: string; data: string },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const setSessionName = useSetSessionNameHook();

  const mutationFn: MutationFunction<
    Awaited<ReturnType<ReturnType<typeof useSetSessionNameHook>>>,
    { sessionId: string; data: string }
  > = (props) => {
    const { sessionId, data } = props ?? {};

    return setSessionName(sessionId, data);
  };

  return useMutation<
    Awaited<ReturnType<typeof setSessionName>>,
    TError,
    { sessionId: string; data: string },
    TContext
  >(mutationFn, mutationOptions);
};

/**
 * @summary Get the current program state
 */
export const useGetProgramHook = () => {
  const getProgram = useCustomInstance<Prog>();

  return (
    sessionId: string,
    params?: GetProgramParams,
    signal?: AbortSignal
  ) => {
    return getProgram({
      url: `/openapi/sessions/${sessionId}/program`,
      method: "get",
      params,
      ...(signal ? { signal } : {}),
    });
  };
};

export const getGetProgramQueryKey = (
  sessionId: string,
  params?: GetProgramParams
) => [`/openapi/sessions/${sessionId}/program`, ...(params ? [params] : [])];

export type GetProgramQueryResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useGetProgramHook>>>
>;
export type GetProgramQueryError = ErrorType<void>;

export const useGetProgram = <
  TData = Awaited<ReturnType<ReturnType<typeof useGetProgramHook>>>,
  TError = ErrorType<void>
>(
  sessionId: string,
  params?: GetProgramParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<ReturnType<typeof useGetProgramHook>>>,
      TError,
      TData
    >;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetProgramQueryKey(sessionId, params);

  const getProgram = useGetProgramHook();

  const queryFn: QueryFunction<
    Awaited<ReturnType<ReturnType<typeof useGetProgramHook>>>
  > = ({ signal }) => getProgram(sessionId, params, signal);

  const query = useQuery<
    Awaited<ReturnType<ReturnType<typeof useGetProgramHook>>>,
    TError,
    TData
  >(queryKey, queryFn, {
    enabled: !!sessionId,
    cacheTime: 0,
    ...queryOptions,
  }) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary Get the current server version
 */
export const useGetVersionHook = () => {
  const getVersion = useCustomInstance<string>();

  return (signal?: AbortSignal) => {
    return getVersion({
      url: `/openapi/version`,
      method: "get",
      ...(signal ? { signal } : {}),
    });
  };
};

export const getGetVersionQueryKey = () => [`/openapi/version`];

export type GetVersionQueryResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useGetVersionHook>>>
>;
export type GetVersionQueryError = ErrorType<unknown>;

export const useGetVersion = <
  TData = Awaited<ReturnType<ReturnType<typeof useGetVersionHook>>>,
  TError = ErrorType<unknown>
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<ReturnType<typeof useGetVersionHook>>>,
    TError,
    TData
  >;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetVersionQueryKey();

  const getVersion = useGetVersionHook();

  const queryFn: QueryFunction<
    Awaited<ReturnType<ReturnType<typeof useGetVersionHook>>>
  > = ({ signal }) => getVersion(signal);

  const query = useQuery<
    Awaited<ReturnType<ReturnType<typeof useGetVersionHook>>>,
    TError,
    TData
  >(queryKey, queryFn, { cacheTime: 0, ...queryOptions }) as UseQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};
