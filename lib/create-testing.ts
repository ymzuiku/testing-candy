import { TESTING, TESTING_RESULT, TESTING_STATE, TEST_ALL } from "./keys";
import { onTesting } from "./on-testing";
import { hiddenTastingMask } from "./render-tasting-mask";
import { storageGet, storageRemove, storageSet } from "./task";
import { Testing } from "./testing";
import { testingOptions } from "./testing-options";

export interface CreateTestingOptions {
  onError?: (err: Error, key: string) => void;
  onBeforeEach?: (key: string) => void;
  onSuccess?: (key: string) => void;
  enable?: boolean;
  tests: Record<string, { id?: string; name: string; test: (testing: Testing) => void }[]>;
}

export function createTesting({ onError, onSuccess, onBeforeEach, tests, enable = true }: CreateTestingOptions) {
  testingOptions.e2e = () => {
    testingOptions.enable = enable;
    if (enable !== void 0) {
      if (enable) {
        storageSet(TESTING, "1");
      } else {
        storageRemove(TESTING);
      }
    }

    if (onBeforeEach) {
      testingOptions.onBeforeEach = onBeforeEach;
    }
    testingOptions.onError = (e, key) => {
      storageSet(TESTING_RESULT, "fail");
      onError?.(e, key);
    };
    testingOptions.onTagChange = (value, tasks) => {
      tasks.cleanTasks();
      storageRemove(TESTING_RESULT);
      storageSet(TESTING_STATE, value);
      testingOptions.e2e();
    };
    const realTest = { ...tests };
    Object.values(tests).forEach((list, a) => {
      list.forEach((item, b) => {
        if (testingOptions.keepSameKey) {
          item.id = `${item.name} [${a + 1}/${b + 1}]`;
        } else {
          item.id = item.name;
        }
      });
    });
    realTest[TEST_ALL] = Object.values(realTest).flat();
    testingOptions.selects = Object.keys(realTest);
    (async () => {
      const state = storageGet(TESTING_STATE) || "";
      onTesting("", []);

      if (storageGet(TESTING_RESULT)) {
        return;
      }

      for (const key of testingOptions.selects) {
        if (storageGet(TESTING_RESULT) === "fail") {
          break;
        }
        if (state === key) {
          await onTesting(key, realTest[key]);
        }
      }

      setTimeout(() => {
        const result = storageGet(TESTING_RESULT);
        if (!result) {
          onSuccess?.(state);
          storageSet(TESTING_RESULT, "success");
        }
        hiddenTastingMask();
      }, 100);
    })();
  };
  testingOptions.e2e();
}

createTesting.unEnable = () => {
  storageRemove(TESTING);
};
