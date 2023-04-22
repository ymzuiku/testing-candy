# testing-candy

In your Browser run e2e testing

![](/candy.gif)

### 1. Install

```sh
npm/pnpm/yarn install @amarkdown/testing-candy
```

### 2. Use import("@amarkdown/testing-candy") in your project

only import library in dev host:

```ts
import { router } from "router";
import { registerE2e, roleE2e, memberE2e, databaseE2e } from "./e2e";

const isWebDev =
  process.env.NODE_ENV === "development" ||
  location.host === "your-dev-host.com";

if (isWebDev) {
  import("@amarkdown/testing-candy").then(
    ({ testingOptions, createTesting }) => {
      // option, default: testingOptions.push = ()=> location.href = url;
      testingOptions.push = router.push;

      createTesting({
        onError: (err: Error, key: string) => {
          alert(err);
        },
        onSuccess: (key) => {
          alert(key);
        },
        tests: {
          role: [
            { name: "login", test: registerE2e },
            { name: "role", test: roleE2e },
          ],
          member: [
            { name: "register", test: registerE2e },
            { name: "member", test: memberE2e },
          ],
          databases: [
            { name: "register", test: registerE2e },
            { name: "role", test: roleE2e },
            { name: "member", test: memberE2e },
            { name: "database", test: databaseE2e },
          ],
        },
      });
    }
  );
}
```

### 3. Write your e2e functions:

- testingLibrary is `@testing-library/dom`
- userEvent is `@testing-library/user-event`
- faker is `@faker-js/faker`
- candy is base the `testingLibrary`, add auto wait for network \ log \ waiting feature

```ts
import type { Testing } from "@amarkdown/testing-candy";

export async function registerE2e({ candy, faker, testingLibrary }: Testing) {
  await candy.push("/", { beforeWait: 1000 });
  const email = faker.internet.email();
  const pwd = faker.internet.password() + "a1";
  console.log("test account:", email, pwd);

  // role, testId, text, labelText: https://testing-library.com/docs/queries/about
  await candy.clickByRole("register");
  await candy.clickByRole("goto_register");
  await candy.changeByRole("register_email", email);
  await candy.changeByRole("register_password", pwd);
  await candy.changeByRole("register_password2", pwd);
  await candy.clickByRole("verification_button", { key: "2" });
  await candy.changeByRole("register_username", email.split("@")[0]);
  await candy.clickByTestId("successful_send_verification");
  await candy.changeByRole("register_code", "999999");
  await candy.clickByRole("submit");
}

export async function roleE2e() {
  // ...
}
export async function memberE2e() {
  // ...
}
export async function databaseE2e() {
  // ...
}
```

### Example
