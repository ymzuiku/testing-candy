import { renderTestingSelect } from "./render-tasting-select";
import * as task from "./task";
import { vconsole } from "./vconsole";

export function isNeedTesting(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  vconsole();

  if (/testing=remove/.test(location.href)) {
    task.storageRemove("testing");
    task.cleanTasks();
  }

  if (!/testing=1/.test(location.href) && task.storageGet("testing") !== "1") {
    return false;
  }
  task.storageSet("testing", "1");
  renderTestingSelect();
  return true;
}
