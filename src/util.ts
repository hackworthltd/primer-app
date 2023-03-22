import { RefObject, useMemo, useSyncExternalStore } from "react";

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
