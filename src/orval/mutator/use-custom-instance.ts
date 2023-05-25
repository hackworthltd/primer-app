import Axios, { AxiosRequestConfig, AxiosError } from "axios";

export const instance = Axios.create({
  baseURL: import.meta.env["VITE_API_URL"],
  withCredentials: true,
});

// Ugh, Orval doesn't do date conversion for us. The following is
// adapted from:
//
// https://orval.dev/reference/configuration/output#usedates

instance.interceptors.response.use((originalResponse) => {
  handleDates(originalResponse.data);
  return originalResponse;
});

const lastModifiedRE = /^lastModified$/;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== "object")
    return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (lastModifiedRE.test(key)) {
      body[key] = new Date(value);
    } else if (typeof value === "object") {
      handleDates(value);
    }
  }
}

export const useCustomInstance = <T>(): ((
  config: AxiosRequestConfig
) => Promise<T>) => {
  const token = "placeholder";

  return (config: AxiosRequestConfig) => {
    const promise = instance({
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
