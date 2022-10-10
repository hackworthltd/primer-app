import Axios, { AxiosRequestConfig, AxiosError } from "axios";

export const AXIOS_INSTANCE = Axios.create({
  baseURL: import.meta.env["VITE_API_URL"],
});

export const useCustomInstance = <T>(): ((
  config: AxiosRequestConfig
) => Promise<T>) => {
  const token = "placeholder";

  return (config: AxiosRequestConfig) => {
    const promise = AXIOS_INSTANCE({
      ...config,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(({ data }) => data);

    return promise;
  };
};

export default useCustomInstance;

export type ErrorType<Error> = AxiosError<Error>;
