import type { Testing } from "@amarkdown/testing-candy";

export async function clickE2e({ candy }: Testing) {
  await candy.clickByRole("count", { beforeWait: 50 });
  await candy.clickByRole("count", { beforeWait: 50 });
  await candy.clickByRole("count", { beforeWait: 50 });
  await candy.clickByRole("count", { beforeWait: 50 });
  await candy.clickByRole("count", { beforeWait: 50 });
}
