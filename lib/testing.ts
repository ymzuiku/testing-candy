import { candy } from "./candy";
import { testing, userEvent } from "./finder";
import { md5 } from "./utils";

export interface Testing {
  userEvent: typeof import("@testing-library/user-event")["default"];
  testingLibrary: typeof import("@testing-library/dom");
  faker: typeof import("@faker-js/faker").faker;
  candy: typeof candy;
  md5: typeof md5;
}

export let lib: Testing;

export async function getTesting() {
  if (!lib) {
    const testingLibrary = await testing();
    const userEvent2 = await userEvent();

    const faker = (await import("@faker-js/faker")).faker;
    lib = { testingLibrary, userEvent: userEvent2, faker, candy, md5 };
  }

  return lib;
}
