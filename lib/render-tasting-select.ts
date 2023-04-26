import { QUIT_TESTING_MODE, TEST, TESTING, TESTING_STATE, TEST_AGAIN, TEST_FETCH_DELAY, TEST_STEP_DELAY } from "./keys";
import * as task from "./task";
import { testingOptions } from "./testing-options";
import { numberToString } from "./utils";

const baseSelectsPrefix = [TEST, TEST_STEP_DELAY, TEST_FETCH_DELAY, TEST_AGAIN];
const baseSelectsLast = [QUIT_TESTING_MODE];

function setSelecteValues(div: HTMLDivElement) {
  div.innerHTML = "";
  const selects = document.createElement("select");
  selects.value = "TEST";
  selects.name = "testing-select";
  Object.assign(selects.style, {
    appearance: "none",
    boxShadow: "none",
    border: "none",
    borderRadius: "0px",
    outline: "none",
    background: "rgba(0,0,0,0)",
    color: "#fff",
    padding: "0px",
    fontSize: "14px",
    position: "absolute",
    left: 0,
    top: 0,
    width: "100px",
    opacity: "0",
  });

  Object.assign(div.style, {
    right: "0",
    top: "0",
    position: "fixed",
    zIndex: "9999",
    width: "100px",
    height: "20px",
    background: "#f33",
    opacity: "0.6",
    cursor: "pointer",
    transformOrigin: "left",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transform: "rotate(45deg) translate(11px, -50px)",
  });
  const label = document.createElement("div");
  Object.assign(label.style, {
    width: "100px",
    height: "100%",
    textAlign: "center",
    PointerEvent: "none",
    color: "#fff",
    marginTop: "3px",
    fontSize: "14px",
    fontWeight: "700",
  });
  label.textContent = "TEST";
  div.appendChild(label);
  div.append(selects);

  const selectedList = [
    ...baseSelectsPrefix,
    ...testingOptions.selects,
    ...(testingOptions.enable === void 0 ? baseSelectsLast : []),
  ];
  selectedList.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    selects.append(opt);
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selects.onchange = (e: any) => {
    const value = e.target.value as string;
    selects.value = TEST;
    if (value === TEST_STEP_DELAY) {
      const t = prompt(
        "Please input step time(ms):",
        numberToString(task.getStepTime(), String(testingOptions.stepDelay)),
      );
      if (t === null) {
        return;
      }
      const t2 = Number(t);
      if (isNaN(t2)) {
        return;
      }
      task.setStepTime(t2);
      return;
    }
    if (value === TEST_FETCH_DELAY) {
      const t = prompt(
        "Please input step time(ms):",
        numberToString(task.getFetchDelay(), String(testingOptions.fetchDelay)),
      );
      if (t === null) {
        return;
      }
      const t2 = Number(t);
      if (isNaN(t2)) {
        return;
      }
      task.setFetchDelay(t2);
      return;
    }
    if (value === QUIT_TESTING_MODE) {
      task.cleanTasks();
      task.storageRemove(TESTING);
      location.reload();
      return;
    }
    if (value === TEST) {
      task.cleanTasks();
      task.storageRemove(TESTING_STATE);
      return;
    }
    if (value === TEST_AGAIN) {
      const last = task.getDoing();
      task.cleanTasks();
      task.setDoing(last);
      testingOptions.e2e();
      return;
    }
    testingOptions.onTagChange(value, task);
  };
}

export function renderTestingSelect() {
  const old = document.getElementById("renderTestingTag") as HTMLDivElement;
  if (old) {
    setSelecteValues(old);
    return;
  }

  const div = document.createElement("div");
  div.id = "renderTestingTag";
  setSelecteValues(div);
  document.body.appendChild(div);
}
