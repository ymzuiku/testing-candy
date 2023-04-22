import { TESTING_RESULT } from "./keys";

const TESTING_HISTORY = "testing-history";

export function storageRemove(key: string) {
  if (typeof window === "undefined") {
    return void 0;
  }
  sessionStorage.removeItem(key);
}

export function storageGet(key: string) {
  if (typeof window === "undefined") {
    return void 0;
  }
  const v = sessionStorage.getItem(key);
  if (!v) {
    return void 0;
  }
  try {
    return JSON.parse(v).j;
  } catch (e) {
    return void 0;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function storageSet(key: string, value: any) {
  if (typeof window === "undefined") {
    return;
  }
  sessionStorage.setItem(key, JSON.stringify({ j: value }));
}

function geTaskHistory() {
  let his = storageGet(TESTING_HISTORY);
  if (!his) {
    his = {};
  }
  return his;
}

export function isDone(key: string) {
  const his = geTaskHistory();
  return his[his.doing + key] === "done";
}

export function setDone(key: string) {
  const his = geTaskHistory();
  his[his.doing + key] = "done";
  storageSet(TESTING_HISTORY, his);
}

// export function isDoneGroup(key: string) {
//   const his = geTaskHistory();
//   return his[key + "--group"] === "done";
// }
// export function setDoneGroup(key: string) {
//   const his = geTaskHistory();
//   his[key + "--group"] = "done";
//   storageSet(TESTING_HISTORY, his);
// }

export function setDoing(key: string) {
  const his = geTaskHistory();
  his.doing = key;
  storageSet(TESTING_HISTORY, his);
}
export function getDoing() {
  const his = geTaskHistory();
  return his.doing;
}

export function cleanTasks() {
  storageRemove(TESTING_RESULT);
  storageSet(TESTING_HISTORY, {});
}

export function setStepTime(t: number) {
  storageSet("stepTime", t);
}

export function getStepTime(): number | null {
  const v = storageGet("stepTime");
  if (v !== 0 && !v) {
    return null;
  }
  return v;
}

export function setFetchDelay(t: number) {
  storageSet("fetchDelay", t);
}

export function getFetchDelay(): number | null {
  const v = storageGet("fetchDelay");
  if (v !== 0 && !v) {
    return null;
  }
  return v;
}
