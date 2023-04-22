import { isFetching } from "./bind-wait-by-event";
import { waiting } from "./utils";

let _testing: typeof import("@testing-library/dom");
let _userEvent: typeof import("@testing-library/user-event")["default"];

export async function testing() {
  if (!_testing) {
    _testing = await import("@testing-library/dom");
  }
  return _testing;
}

export async function userEvent() {
  if (!_userEvent) {
    _userEvent = (await import("@testing-library/user-event")).default;
  }
  return _userEvent;
}

export const findWait = async (
  fn: () => Promise<HTMLElement | void | null>,
  timeout = 3000,
  n = 0,
  errorMsg = "Not found element",
): Promise<HTMLElement> => {
  if (n > timeout / 100) {
    throw new Error(errorMsg);
  }
  const ele = await fn();

  if (ele) {
    return ele;
  }
  await waiting(100);
  if (isFetching()) {
    return findWait(fn, timeout, n, errorMsg);
  }
  return findWait(fn, timeout, n + 1, errorMsg);
};

export const queryInputValue = async (role: string, timeout = 3000): Promise<HTMLElement> => {
  return findWait(
    async () => {
      let input: HTMLElement | void = void 0;
      document.querySelectorAll("input, textarea").forEach((v) => {
        if ((v as HTMLInputElement).value === role) {
          input = v as HTMLElement;
        }
      });
      return input;
    },
    timeout,
    0,
    "Not found input element value is: " + role,
  );
};

export const queryByRole = async (role: string, timeout = 3000): Promise<HTMLElement> => {
  return findWait(
    async () => {
      const t = await testing();
      return t.screen.queryByRole(role);
    },
    timeout,
    0,
    "Not found role element: " + role,
  );
};

export const queryByTestId = async (role: string, timeout = 3000): Promise<HTMLElement> => {
  return findWait(async () => {
    const t = await testing();
    return t.screen.queryByTestId(role, {});
  }, timeout);
};

export const queryByText = async (role: string, timeout = 3000): Promise<HTMLElement> => {
  return findWait(
    async () => {
      const t = await testing();
      return t.screen.queryByText(role, { trim: true });
    },
    timeout,
    0,
    "Not found text element: " + role,
  );
};

export const queryByLabelText = async (role: string, timeout = 3000): Promise<HTMLElement> => {
  return findWait(
    async () => {
      const t = await testing();
      return t.screen.queryByLabelText(role, { trim: true, selector: "*" });
    },
    timeout,
    0,
    "Not found label text element: " + role,
  );
};

export const changeByRole = async (
  role: string,
  value: string | number | boolean,
  timeout = 3000,
): Promise<HTMLElement> => {
  const ele = await queryByRole(role, timeout);
  const t = await testing();
  t.fireEvent.change(ele, { target: { value } });
  return ele;
};

export const clickByRole = async (role: string, timeout = 3000): Promise<HTMLElement> => {
  const ele = await queryByRole(role, timeout);
  const t = await testing();
  t.fireEvent.click(ele);
  return ele;
};

export const changeByTestId = async (
  role: string,
  value: string | number | boolean,
  timeout = 3000,
): Promise<HTMLElement> => {
  const ele = await queryByTestId(role, timeout);
  const t = await testing();
  t.fireEvent.change(ele, { target: { value } });
  return ele;
};

export const clickByTestId = async (role: string, timeout = 3000): Promise<HTMLElement> => {
  const ele = await queryByTestId(role, timeout);
  const t = await testing();
  t.fireEvent.click(ele);
  return ele;
};
