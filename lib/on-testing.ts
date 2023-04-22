/* eslint-disable @typescript-eslint/no-explicit-any */
import { bindKeyboards } from "./bind-keyboards";
import { bindFetchDelay } from "./bind-promise-delay";
import { bindWaitByFech } from "./bind-wait-by-event";
import { isNeedTesting } from "./is-need-testing";
import * as task from "./task";
import { getTesting, Testing } from "./testing";
import { testingOptions } from "./testing-options";

export type { Testing };

// 在开发环境下进行 e2e 测试
export const onTesting = async (
  key: string,
  fn: { id?: string; name: string; test: (testing: Testing, key: string) => any }[],
) => {
  let lockKey = "";
  if (!isNeedTesting()) {
    return;
  }

  const lib = await getTesting();

  if (!key) {
    return;
  }

  bindKeyboards();
  bindWaitByFech();

  testingOptions.stepDelay = task.getStepTime() !== null ? (task.getStepTime() as number) : testingOptions.stepDelay;
  testingOptions.fetchDelay =
    task.getFetchDelay() !== null ? (task.getFetchDelay() as number) : testingOptions.stepDelay;
  bindFetchDelay(testingOptions.fetchDelay);

  try {
    if (Array.isArray(fn)) {
      for (const onFn of fn) {
        lockKey = key + "/" + onFn.id;
        task.setDoing(lockKey);
        await onFn.test(lib, lockKey);
        testingOptions.onBeforeEach(lockKey);
      }
    }
  } catch (err: any) {
    const error = Error(err.toString().split("\n")[0], { cause: err });
    console.error(error);
    if (testingOptions.onError) {
      testingOptions.onError(error, lockKey);
    }
  }
};
