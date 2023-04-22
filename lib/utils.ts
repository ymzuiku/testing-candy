import CryptoES from "crypto-es";

export const md5 = (msg: string) => {
  return CryptoES.MD5(msg).toString();
};
//  const isWebDev = process.env.NODE_ENV === "development";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function getFunctionName(fn: any) {
//   const fnString = fn.toString().trim();
//   if (!isWebDev) {
//     return md5(fnString).substring(0, 7);
//   }
//   const regex = /^(async\s*)?([\w]+)?\s*(=>)?\s*function\s*([^\s(]+)/;
//   const match = fnString.match(regex);
//   // return (match ? match[2] || match[4] : "") + "-" + md5(fnString).substring(0, 6);
//   return match ? match[2] || match[4] : "";
// }

export async function waiting(delay = 17) {
  if (delay <= 0) {
    return;
  }
  if (typeof requestIdleCallback === "undefined" || typeof requestAnimationFrame === "undefined") {
    await new Promise((res) => {
      setTimeout(() => {
        res(void 0);
      }, 20);
    });
  } else {
    await new Promise((res) => requestAnimationFrame(res));
  }
  await new Promise((res) => {
    setTimeout(() => {
      res(void 0);
    }, delay);
  });
}

export function numberToString(value: number | void | null | string, defaultEmpty = "") {
  if (typeof value === "string") {
    return value;
  }
  if (value === null || value === void 0) {
    return defaultEmpty;
  }
  return String(value);
}
