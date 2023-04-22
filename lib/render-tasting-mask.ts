import { testingOptions } from "./testing-options";

function getElementRect(ele?: HTMLElement | null | void) {
  if (typeof window === "undefined" || !ele) {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      fixedTop: 0,
      fixedLeft: 0,
    };
  }
  const rect = ele.getBoundingClientRect();
  const pos = { top: 0, left: 0 };
  let e = ele;
  while (e) {
    pos.left += e.offsetLeft;
    pos.top += e.offsetTop;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    e = e.offsetParent as any;
  }

  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    fixedTop: pos.top + document.documentElement.scrollTop,
    fixedLeft: pos.left + document.documentElement.scrollLeft,
  };
}

let n = 0;

export function renderTastingMask(ele: HTMLElement) {
  let mask = document.getElementById("testing-mask") as HTMLDivElement;
  if (!mask) {
    mask = document.createElement("div");
    mask.id = "testing-mask";
    mask.style.pointerEvents = "none";
    mask.style.transition = `all ${testingOptions.stepDelay < 50 ? 50 : testingOptions.stepDelay * 0.7}ms ease`;
    mask.style.background = "rgba(255,100,100,0.3)";
    mask.style.border = "1px solid rgba(128,128,128,0.3)";
    mask.style.width = "30px";
    mask.style.height = "30px";
    mask.style.borderRadius = "6px";
    mask.style.zIndex = "99999";
    mask.style.position = "fixed";
    mask.style.transformOrigin = "center";
    document.body.append(mask);
  }
  n += 1;
  if (n > 99) {
    n = 0;
  }

  const rect = getElementRect(ele);

  Object.assign(mask.style, {
    opacity: "1",
    transform: `rotate(${n * 720}deg)`,
    left: rect.fixedLeft + rect.width / 2 - 15 + "px",
    top: rect.fixedTop + rect.height / 2 - 15 + "px",
  });
}

export function hiddenTastingMask() {
  const mask = document.getElementById("testing-mask") as HTMLDivElement;
  if (mask) {
    mask.style.opacity = "0";
  }
}
