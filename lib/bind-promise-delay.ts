import { renderTastingLog } from "./render-tasting-log";
import { testingOptions } from "./testing-options";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
type AnyPromiseFn = (...args: Any) => Promise<Any>;

export function bindPromiseDelay(event: AnyPromiseFn, delay: number) {
  if (delay < 1) {
    return event;
  }
  const baseFetch = event;

  return async function (...args: unknown[]) {
    const res = baseFetch(...args).finally(() => {});
    if (delay >= testingOptions.minLogDelay) {
      renderTastingLog("Fetch delay: " + delay + "ms");
    }
    await new Promise((res) => setTimeout(res, delay));
    return res;
  };
}

export function bindFetchDelay(delay: number) {
  (window as Any).fetch = bindPromiseDelay(window.fetch, delay);
}
