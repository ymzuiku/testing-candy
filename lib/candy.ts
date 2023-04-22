import {
  changeByRole,
  changeByTestId,
  clickByRole,
  clickByTestId,
  queryByLabelText,
  queryByRole,
  queryByTestId,
  queryByText,
  queryInputValue,
} from "./finder";
import { renderTastingLog } from "./render-tasting-log";
import { renderTastingMask } from "./render-tasting-mask";
import { isDone, setDone } from "./task";
import { testingOptions } from "./testing-options";
import { waiting } from "./utils";

interface CandyOptions {
  key?: string | number;
  timeout?: number;
  beforeWait?: number;
  afterWait?: number;
}

let loaded = false;

if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    loaded = true;
  });
}

async function waitPageLoaded(): Promise<void> {
  if (loaded) {
    return;
  }
  setTimeout(() => {
    waitPageLoaded();
  }, 50);
}

// const cache: Record<string, boolean> = {};

async function testElement(
  text: string,
  { beforeWait, afterWait, key }: CandyOptions,
  fn: () => Promise<HTMLElement | void>,
) {
  await candy.it(text + (key || ""), async () => {
    if (beforeWait) {
      if (beforeWait >= testingOptions.minLogDelay) {
        renderTastingLog("Before waiting: " + beforeWait + "ms, " + text);
      }
      await waiting(beforeWait);
    }
    const ele = await fn();
    if (ele) {
      renderTastingMask(ele);
    }
    if (afterWait) {
      if (afterWait >= testingOptions.minLogDelay) {
        renderTastingLog("After waiting: " + afterWait + "ms, " + text);
      }
      await waiting(afterWait);
    }
  });
}

const cache: Record<string, number> = {};

export const candy = {
  queryByLabelText,
  queryByRole,
  queryByTestId,
  queryByText,
  queryInputValue,
  it: async function (key: string, fn: (() => void) | (() => Promise<void>)) {
    let lockKey = key;
    if (testingOptions.keepSameKey) {
      if (!cache[key]) {
        cache[key] = 0;
      }
      cache[key] += 1;
      lockKey = key + " " + cache[key];
      if (isDone(lockKey)) {
        return;
      }
    }

    await waitPageLoaded();
    setDone(key + cache);
    if (testingOptions.stepDelay >= testingOptions.minLogDelay) {
      renderTastingLog("Step delay: " + testingOptions.stepDelay + "ms");
    }
    await waiting(testingOptions.stepDelay);
    renderTastingLog(lockKey);
    await waiting(20);
    await Promise.resolve(fn());
    setDone(lockKey);
  },
  async push(url: string, opt: CandyOptions = {}) {
    return testElement(url, opt, async () => {
      await waiting(100);
      await testingOptions.push(url);
      await waiting(100);
    });
  },
  async wait(key: string, delay: number) {
    return candy.it("[wait]" + key, async () => {
      await new Promise((res) => setTimeout(res, delay));
    });
  },
  async findByRole(text: string, { timeout = testingOptions.timeout, ...rest }: CandyOptions = {}) {
    return testElement(text.trim(), rest, async () => {
      return queryByRole(text, timeout);
    });
  },
  async findByText(text: string, { timeout = testingOptions.timeout, ...rest }: CandyOptions = {}) {
    return testElement(text.trim(), rest, async () => {
      return queryByText(text, timeout);
    });
  },
  async findByLabelText(text: string, { timeout = testingOptions.timeout, ...rest }: CandyOptions = {}) {
    return testElement(text.trim(), rest, async () => {
      return queryByLabelText(text, timeout);
    });
  },
  async findByInputValue(text: string, { timeout = testingOptions.timeout, ...rest }: CandyOptions = {}) {
    return testElement(text.trim(), rest, () => {
      return queryInputValue(text, timeout);
    });
  },
  async clickByRole(role: string, { timeout = testingOptions.timeout, ...rest }: CandyOptions = {}) {
    return testElement(role, rest, async () => {
      return clickByRole(role, timeout);
    });
  },

  async changeByRole(
    role: string,
    value: string | number | boolean,
    { timeout = testingOptions.timeout, ...rest }: CandyOptions = {},
  ) {
    return testElement(role, rest, () => {
      return changeByRole(role, value, timeout);
    });
  },
  async clickByTestId(id: string, { timeout = testingOptions.timeout, ...rest }: CandyOptions = {}) {
    return testElement(id, rest, () => {
      return clickByTestId(id, timeout);
    });
  },
  async changeByTestId(
    id: string,
    value: string | number | boolean,
    { timeout = testingOptions.timeout, ...rest }: CandyOptions = {},
  ) {
    return testElement("[changeByTestId] " + id, rest, () => {
      return changeByTestId(id, value, timeout);
    });
  },
  not: async function (key: string, fn: () => Promise<void>, macRepeat = 10) {
    let n = 0;
    const loadNotPass = async (): Promise<void> => {
      if (n > macRepeat) {
        throw new Error("always find by: " + key);
      }
      n += 1;
      try {
        await waiting(100);
        await fn();
        return loadNotPass();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (!err.message) {
          throw err;
        }
        const message = err.message.split("\n")[0] as string;
        if (/Found multiple elements/.test(message)) {
          return loadNotPass();
        }
      }
    };
    return loadNotPass();
  },
  notFindByRole: async function (role: string, timeout = 300) {
    return candy.not(role, async () => {
      await queryByRole(role, timeout);
    });
  },
  notFindByTestId: async function (role: string, timeout = 300) {
    return candy.not(role, async () => {
      await queryByTestId(role, timeout);
    });
  },
  notFindByText: async function (role: string, timeout = 300) {
    return candy.not(role, async () => {
      await queryByText(role, timeout);
    });
  },
  notFindByLabelText: async function (role: string, timeout = 300) {
    return candy.not(role, async () => {
      await queryByLabelText(role, timeout);
    });
  },
};
