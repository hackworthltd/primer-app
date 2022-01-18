import Axios, { AxiosRequestConfig, AxiosError } from "axios";

export const AXIOS_INSTANCE = Axios.create({ baseURL: "" });

export const useCustomInstance = <T>(): ((
  config: AxiosRequestConfig
) => Promise<T>) => {
  const token = "placeholder";

  return (config: AxiosRequestConfig) => {
    const source = Axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
      ...config,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cancelToken: source.token,
    }).then(({ data }) => data);

    // @ts-ignore
    promise.cancel = () => {
      source.cancel("Query was cancelled by React Query");
    };

    return promise;
  };
};

export default useCustomInstance;

export type ErrorType<Error> = AxiosError<Error>;
