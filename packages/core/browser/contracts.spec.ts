import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("initial HTML has label, explicit description links and invalid state without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  const input = page.getByRole("textbox", { name: "Email" });
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveAccessibleDescription(
    "Use your work email. Error: Enter your work email.",
  );
  await expect(page.getByText("AL", { exact: true })).toBeVisible();
  await context.close();
});

test("native form, read-only and keyboard contracts survive hydration", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByText("Submissions: 0")).toBeVisible();
  await expect(page.getByRole("button", { name: "More", exact: true })).toBeDisabled();
  await expect(page.getByRole("spinbutton")).toHaveValue("2");
  expect(
    await page
      .locator("form")
      .evaluate((form) => new FormData(form as HTMLFormElement).get("quantity")),
  ).toBe("2");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Submissions: 1")).toBeVisible();
  await page.getByRole("tab", { name: "One", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Two", exact: true })).toBeFocused();
  await expect(page.getByText("Last key: ArrowRight")).toBeVisible();
  expect(errors).toEqual([]);
});

test("lazy Avatar recovers from failure, maintains its name and passes rendered axe checks", async ({
  page,
}) => {
  await page.goto("/");
  const avatar = page.getByRole("img", { name: "Ada Lovelace" });
  const image = avatar.locator("img");
  await expect(image).toHaveAttribute("data-error", "");
  await expect(page.getByText("AL", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Retry image" }).click();
  await expect(image).not.toHaveAttribute("data-loading", "");
  await expect(image).toBeVisible();
  await expect(page.getByText("AL", { exact: true })).toBeHidden();
  const box = await avatar.boundingBox();
  expect(box?.width).toBeGreaterThan(0);
  expect(box?.height).toBe(box?.width);
  await page.screenshot({ path: test.info().outputPath("composition.png"), fullPage: true });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("native modal contains focus, closes with Escape and restores the trigger", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open dialog" });
  await trigger.focus();
  await trigger.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Confirm change" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty("open", true);
  expect(await dialog.evaluate((element) => element.matches(":modal"))).toBe(true);
  // Native dialogs may cycle focus through browser chrome at the boundary.
  // Verify that tabbing cannot reach a background control, without replacing
  // the browser's own focus behavior with a JavaScript trap.
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate(
        (element) =>
          document.activeElement === document.body || element.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await dialog.evaluate(async (element) => {
    await Promise.all(
      element.getAnimations({ subtree: true }).map((animation) => animation.finished),
    );
  });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("Avatar centers fallback content before hydration in either parts order", async ({
  browser,
  baseURL,
  colorScheme,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, colorScheme });
  const page = await context.newPage();
  await page.goto(baseURL!);
  const section = page.getByRole("region", { name: "Avatar fallbacks" });
  for (const name of ["Grace Hopper", "Katherine Johnson", "Anonymous"]) {
    const avatar = section.getByRole("img", { name });
    await expect(avatar.locator(".fallback")).toBeVisible();
    const offset = await avatar.evaluate((root) => {
      const range = document.createRange();
      range.selectNodeContents(root.querySelector(".fallback")!);
      const content = range.getBoundingClientRect();
      const box = root.getBoundingClientRect();
      return Math.abs(content.x + content.width / 2 - box.x - box.width / 2);
    });
    expect(offset).toBeLessThan(1);
  }
  const icon = section.getByRole("img", { name: "Anonymous" }).locator("svg");
  expect((await icon.boundingBox())!.width).toBeCloseTo(26, 0);
  await page.screenshot({ path: test.info().outputPath("avatar-fallbacks.png"), fullPage: true });
  await context.close();
});

test("Field composes with native checkbox, radio and switch behavior", async ({ page }) => {
  await page.goto("/");
  const checkbox = page.getByRole("checkbox", { name: "Email updates" });
  await expect(checkbox).toHaveAccessibleDescription("Weekly updates.");
  await page.getByText("Email updates", { exact: true }).click();
  await expect(checkbox).toBeChecked();
  await checkbox.press("Space");
  await expect(checkbox).not.toBeChecked();
  const basic = page.getByRole("radio", { name: "Basic", exact: true });
  const team = page.getByRole("radio", { name: "Team", exact: true });
  await expect(basic).toHaveAccessibleDescription("For individuals.");
  await expect(team).toHaveAccessibleDescription("For groups.");
  expect(await basic.getAttribute("id")).not.toBe(await team.getAttribute("id"));
  await basic.check();
  await basic.press("ArrowDown");
  await expect(team).toBeChecked();
  await expect(basic).not.toBeChecked();
  const toggle = page.getByRole("switch", { name: "Notifications" });
  await toggle.focus();
  await toggle.press("Space");
  await expect(toggle).toBeChecked();
  await expect(toggle).toHaveJSProperty("tagName", "INPUT");
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await expect(page.locator(".loam-Switch-control .track")).toHaveCSS("border-top-width", "1px");
  await expect(page.locator(".loam-Switch-control .thumb")).toHaveCSS("transition-duration", "0s");
});

test("native Input composes in narrow layouts and keeps dependent controls working", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");
  const section = page.getByRole("region", { name: "Input composition" });
  const reference = section.getByRole("textbox", { name: "Reference", exact: true });
  await section.getByText("Reference", { exact: true }).click();
  await expect(reference).toBeFocused();
  expect(await reference.evaluate((input) => input.closest(".loam-Field") !== null)).toBe(true);
  const full = section.getByRole("textbox", { name: "Read-only input" });
  await full.focus();
  await full.press("A");
  await expect(full).toHaveValue("Original");
  await expect(section.getByRole("textbox", { name: "Locked input" })).toBeDisabled();
  expect((await reference.boundingBox())!.width).toBeLessThan((await full.boundingBox())!.width);
  await section.getByRole("button", { name: "Show password" }).click();
  await expect(section.getByLabel("Password", { exact: true })).toHaveAttribute("type", "text");
  const day = section.getByRole("textbox", { name: "Day", exact: true });
  const year = section.getByRole("textbox", { name: "Year", exact: true });
  expect((await day.boundingBox())!.width).toBeLessThan((await year.boundingBox())!.width);
  const crop = section.getByRole("combobox", { name: "Crop" });
  await crop.focus();
  await crop.press("ArrowDown");
  const list = page.getByRole("listbox");
  await expect(list).toBeVisible();
  await expect(crop).toHaveCSS("text-align", "start");
  const anchor = await crop.evaluate((input) =>
    getComputedStyle(input).getPropertyValue("anchor-name"),
  );
  if (await page.evaluate(() => CSS.supports("anchor-name", "--probe"))) {
    expect(anchor).not.toBe("none");
    expect(
      Math.abs((await crop.boundingBox())!.width - (await list.boundingBox())!.width),
    ).toBeLessThan(2);
  }
  await crop.press("Enter");
  await expect(crop).toHaveValue("Carrot");
  const amount = section.getByRole("textbox", { name: "Amount", exact: true });
  await section.getByText("Amount", { exact: true }).click();
  await expect(amount).toBeFocused();
  await amount.fill("25");
  await section.getByRole("combobox", { name: "Currency", exact: true }).selectOption("EUR");
  await expect(section.locator(".amount")).toHaveText("€");
  await expect(amount).toHaveValue("25");
  expect(await section.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
    true,
  );
  await page.screenshot({ path: test.info().outputPath("native-inputs.png"), fullPage: true });
});
