// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
type AnyPromiseFn = (...args: Any) => Promise<Any>;

let fetching = 0;

export function bindWaitByEvent(event: AnyPromiseFn, ignore?: (...args: Any[]) => boolean) {
  const baseFetch = event;

  return async function (...args: unknown[]) {
    if (ignore && ignore(...args)) {
      return baseFetch(...args);
    }
    fetching += 1;
    return baseFetch(...args).finally(() => {
      fetching -= 1;
    });
  };
}

let bindFetched = false;

export function bindWaitByFech() {
  if (bindFetched) {
    return;
  }
  bindFetched = true;
  (window as Any).fetch = bindWaitByEvent(window.fetch, (url: string) => {
    return /\.(svg|jpg|png|gif)/.test(url);
  });
}

export function isFetching() {
  return fetching > 0;
}
