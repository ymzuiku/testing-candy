import * as task from "./task";
import { testingOptions } from "./testing-options";

let binded = false;

export function bindKeyboards() {
  if (typeof window === "undefined") {
    return;
  }
  if (testingOptions.testAgainKey === "" && testingOptions.testReStartKey === "") {
    return;
  }
  if (binded) {
    return;
  }

  binded = true;

  const events = (e: KeyboardEvent) => {
    if (!e.ctrlKey && !e.metaKey) {
      return true;
    }
    if (e.key === testingOptions.testReStartKey) {
      e.preventDefault();
      e.stopPropagation();
      const last = task.getDoing();
      task.cleanTasks();
      task.setDoing(last);
      testingOptions.e2e();
      return false;
    }
    if (e.key === testingOptions.testAgainKey) {
      e.preventDefault();
      e.stopPropagation();
      testingOptions.e2e();
      return false;
    }
    return false;
  };

  window.addEventListener("keydown", events);
}
