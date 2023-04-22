import { testingOptions } from "./testing-options";

let timer: NodeJS.Timer;

export function renderTastingLog(text: string) {
  let label = document.getElementById("testing-label") as HTMLDivElement;
  if (!label) {
    label = document.createElement("div");
    label.id = "testing-label";
    label.style.pointerEvents = "none";
    label.style.transition = `all ${testingOptions.stepDelay < 50 ? 50 : testingOptions.stepDelay * 0.7}ms ease`;
    label.style.background = "rgba(0,0,0,0.5)";
    label.style.color = "#f33";
    label.style.height = "auto";
    label.style.borderRadius = "6px";
    label.style.zIndex = "99999";
    label.style.position = "fixed";
    label.style.padding = "4px 8px";
    label.style.right = "0px";
    label.style.bottom = "0px";
    label.style.whiteSpace = "nowrap";
    label.style.transformOrigin = "center";
    document.body.append(label);
  }

  label.textContent = text;
  label.style.opacity = "1";
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    label.style.opacity = "0";
  }, 5000);
}

export function hiddenTastingMask() {
  const mask = document.getElementById("testing-mask") as HTMLDivElement;
  if (mask) {
    mask.style.opacity = "0";
  }
}
