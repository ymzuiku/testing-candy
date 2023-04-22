import * as task from "./task";

export const testingOptions = {
  timeout: 5000,
  stepDelay: 100,
  fetchDelay: 0,
  maskTime: 0,
  keepSameKey: false,
  testReStartKey: "",
  testAgainKey: "",
  enable: void 0 as boolean | void,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onError: (err: Error, key: string) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onBeforeEach: (key: string) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTagChange: (value: string, tasks: typeof task): void => {},
  selects: [] as string[],
  push: (url: string) => {
    location.href = url;
    return new Promise((res) => setTimeout(res, 100));
  },
  e2e: () => {},
};
