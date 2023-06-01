import deepEqual from "deep-equal";
import {
  RefObject,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

/** Evaluates to the type `true` when both parameters are equal, and `false` otherwise.
 * NB. this actually tests mutual extendability, which is mostly a reasonable definition of
 * of equality, but does mean that, for example, `any` is "equal to" everything, except `never`.
 */
export type Equal<T, S> = [T] extends [S]
  ? [S] extends [T]
    ? true
    : false
  : false;

/** Typechecks succesfully if and only if the input parameter is `true`.
 * At runtime, this function does nothing.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
export const assertType = <T extends true>() => {};

function subscribe(callback: (e: Event) => void) {
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("resize", callback);
  };
}

export function useDimensions(ref: RefObject<HTMLElement>) {
  const dimensions = useSyncExternalStore(subscribe, () =>
    JSON.stringify({
      width: ref.current?.offsetWidth ?? 0,
      height: ref.current?.offsetHeight ?? 0,
    })
  );
  return useMemo(() => JSON.parse(dimensions), [dimensions]);
}

/** Use some initial data, while waiting for an asynchronous update.
 * This encapsulates a common React pattern, which may eventually have a built-in solution:
 * https://github.com/reactjs/rfcs/pull/229.
 * Using this hook also leads to better type inference.
 */
export const usePromise = <T>(initial: T, p: Promise<T>): T => {
  const [data, setData] = useState<T>(initial);
  useEffect(() => {
    p.then(setData);
  }, [p]);
  return data;
};

/** Like `deepEqual`, but also statically checks that types are compatible.
 * Makes it easier to avoid mistakes.
 */
export const deepEqualTyped = <T>(a: T, b: T) => deepEqual(a, b);
