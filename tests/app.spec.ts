import { expect, test } from "@playwright/test";

test("testLong", async ({ page }) => {
	await page.goto("http://192.168.1.3:5173/");
	await expect(page.getByText("This project is open source.")).toBeVisible();
	await page.locator("#top-banner").getByLabel("Close").click();
	await page.getByLabel("Hamburger menu").click();
	await page.locator(".text-gray-900").first().selectOption("deDE");
	await expect(page.getByText("Verfallt [2-3.5] Sek. lang in")).toBeVisible();
	await page.locator(".text-gray-900").first().selectOption("enUS");
	await page.getByLabel("Hamburger menu").click();
	await expect(page.getByText("Gain Berserking for [2-3.5]")).toBeVisible();
	await page.locator(".mt-2 > input").first().click();
	await page.locator(".mt-2 > input").first().fill("55");
	await page.locator(".mt-2 > select").first().selectOption("Amulet");
	await page.locator("div:nth-child(5) > .block").first().click();
	await page.locator("div:nth-child(5) > .block").first().fill("Test1");
	await page.locator(".text-center").first().click();
	await expect(page.getByText("Amulet: (55)")).toBeVisible();
	await page.locator(".mt-2 > input").first().click();
	await page.locator(".mt-2 > input").first().fill("55");
	await page.locator(".mt-2 > select").first().selectOption("Gloves");
	await page.locator("div:nth-child(5) > .block").first().click();
	await page.locator("div:nth-child(5) > .block").first().fill("Test2");
	await page.locator(".mt-2 > .text-center").first().click();
	await expect(page.getByText("Gloves Test2")).toBeVisible();
	await page.locator(".mt-2 > input").first().click();
	await page.locator(".mt-2 > input").first().fill("60");
	await page.locator(".mt-2 > select").first().selectOption("1H-Weapon");
	await page.locator("div:nth-child(5) > .block").first().click();
	await page.locator("div:nth-child(5) > .block").first().fill("Test3");
	await page.locator(".mt-2 > .text-center").first().click();
	await page.locator("div:nth-child(2) > div:nth-child(4) > input").click();
	await page.locator("div:nth-child(2) > div:nth-child(4) > input").fill("2");
	await page.locator("div:nth-child(2) > div:nth-child(4) > select").selectOption("1H-Weapon");
	await page.locator("div:nth-child(2) > div:nth-child(5) > .block").click();
	await page.locator("div:nth-child(2) > div:nth-child(5) > .block").fill("Test4");
	await page.locator("div:nth-child(2) > div:nth-child(5) > .text-center").click();
	await expect(page.getByText("2, 1H-Weapon")).toBeVisible();
	await expect(page.getByText("Test4")).toBeVisible();
	await expect(page.getByText("60, 1H-Weapon")).toBeVisible();
	await expect(page.getByText("Test3")).toBeVisible();
	await page.locator("div:nth-child(2) > div:nth-child(4) > input").click();
	await page.locator("div:nth-child(2) > div:nth-child(4) > input").fill("7");
	await page.locator("div:nth-child(2) > div:nth-child(4) > select").selectOption("2H-Weapon");
	await page.locator("div:nth-child(2) > div:nth-child(5) > .block").click();
	await page.locator("div:nth-child(2) > div:nth-child(5) > .block").fill("Test5");
	await page.locator("div:nth-child(2) > div:nth-child(5) > .text-center").click();
	await expect(page.getByText("2H-Weapon: (7)")).toBeVisible();
	await expect(page.getByText("Test5")).toBeVisible();
	await page.locator("div:nth-child(6) > div:nth-child(4) > input").first().click();
	await page.locator("div:nth-child(6) > div:nth-child(4) > input").first().fill("100");
	await page.locator("input:nth-child(2)").click();
	await page.locator("input:nth-child(2)").fill("20");
	await page.locator("div:nth-child(6) > div:nth-child(4) > select").selectOption("Ring");
	await page.locator("div:nth-child(6) > div:nth-child(5) > .block").click();
	await page.locator("div:nth-child(6) > div:nth-child(5) > .block").fill("Test6");
	await page.locator("div:nth-child(6) > div:nth-child(5) > .text-center").click();
	await expect(page.getByText("/20, Ring")).toBeVisible();
	await expect(page.getByText("Test6")).toBeVisible();
	await expect(page.locator("div:nth-child(6) > div > .p-1 > .text-center")).toBeVisible();
	await expect(page.getByText("Whenever you deal direct")).toBeVisible();
	await expect(page.getByText("While Berserking, you deal")).toBeVisible();
	await expect(page.getByRole("heading", { name: "of Giant Strides, Resource" })).toBeVisible();
	await page.getByPlaceholder("Search by name or description").click();
	await page.getByPlaceholder("Search by name or description").fill("Battle");
	await expect(page.getByRole("heading", { name: "Battle-Mad, Weapon" })).toBeVisible();
	await expect(page.getByText("Gain Berserking for [2-3.5]")).toBeVisible();
	await page.getByLabel("Close").click();
	await expect(page.locator("div:nth-child(16) > div:nth-child(5) > .text-center")).toBeVisible();
	await page.locator("select").first().selectOption("Rogue");
	await expect(page.getByRole("status")).toBeVisible();
	await page.getByRole("combobox").first().selectOption("");
	await page.locator("select:nth-child(4)").selectOption("Gloves");
	await expect(page.getByText("55, Gloves")).toBeVisible();
	await expect(page.locator("div:nth-child(9) > div:nth-child(5) > .text-center")).toBeVisible();
	await page.locator("select:nth-child(4)").selectOption("");
	await expect(page.locator("div:nth-child(16) > div:nth-child(5) > .text-center")).toBeVisible();
	await page.locator("select:nth-child(5)").selectOption("true");
	await expect(page.locator("div:nth-child(9) > div:nth-child(5) > .block")).toBeVisible();
	await page.locator("select:nth-child(5)").selectOption("false");
	await expect(page.getByRole("heading", { name: "Weapon Master's, Utility" })).toBeVisible();
	await expect(page.locator("div:nth-child(7) > div:nth-child(5) > .block")).toBeVisible();
	await page.locator("select:nth-child(5)").selectOption("");
	await page.getByText("Limit to owned").click();
	await expect(page.getByLabel("Show Slot Based View")).toBeVisible();
	await expect(page.getByRole("heading", { name: "of Ancestral Echoes," })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Battle-Mad, Weapon" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Earthquake, Offensive (Codex)" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Add" }).nth(2)).toBeVisible();
	await expect(page.getByText("/20, Ring")).toBeVisible();
	await expect(page.getByText("60, 1H-Weapon")).toBeVisible();
	await expect(page.getByText("2, 1H-Weapon")).toBeVisible();
	await page.getByLabel("Show Slot Based View").check();
	await expect(page.getByRole("heading", { name: "Gloves" })).toBeVisible();
	await expect(
		page
			.getByText("of Ancestral Echoes, Offensive (Codex) Lucky Hit: While Call of the Ancients is")
			.first()
	).toBeVisible();
	await expect(page.getByText("Gloves Test2 X")).toBeVisible();
	await expect(page.getByRole("heading", { name: "Weapon", exact: true })).toBeVisible();
	await expect(page.locator(".p-4 > div:nth-child(3) > div")).toBeVisible();
	await expect(
		page
			.getByText("of Ancestral Echoes, Offensive (Codex) Lucky Hit: While Call of the Ancients is")
			.nth(1)
	).toBeVisible();
	await expect(page.getByText("Battle-Mad, Weapon Gain")).toBeVisible();
	await expect(page.getByText("Amulet of Ancestral Echoes,")).toBeVisible();
	await expect(page.getByText("Amulet: (55)")).toBeVisible();
	await expect(
		page.locator("div").filter({ hasText: "Earthquake, Offensive (Codex" }).nth(3)
	).toBeVisible();
	await expect(
		page.locator("div:nth-child(5) > div > .mb-8 > div > .p-1 > .text-center")
	).toBeVisible();
	await expect(page.getByRole("button", { name: "Add" }).nth(4)).toBeVisible();
	await page.getByLabel("Show Slot Based View").uncheck();
	await expect(
		page.getByText("Earthquake, Offensive (Codex) Ground Stomp creates an Earthquake damaging")
	).toBeVisible();
	await expect(page.getByRole("button", { name: "Add" }).nth(1)).toBeVisible();
	await page.getByLabel("Limit to owned").uncheck();
	await expect(
		page.locator("div").filter({ hasText: "of Ancestral Echoes," }).nth(2)
	).toBeVisible();
	await expect(page.getByText("2H-Weapon: (7)")).toBeVisible();
	await page.locator("div:nth-child(2) > div > div:nth-child(2) > .text-center").click();
	await expect(page.getByText("2H-Weapon: (7)")).toBeVisible({ timeout: 10000, visible: false });
	await page.getByLabel("Limit to owned").check();
	await expect(page.getByText("/20, Ring Test6 X")).toBeVisible();
	await expect(page.getByText("/20, Ring")).toBeVisible();
	await page.getByRole("button", { name: "X" }).nth(4).click();
	await expect(page.getByText("/20, Ring")).toBeVisible({ timeout: 10000, visible: false });
	await page.getByLabel("Show Slot Based View").check();
	await page.getByLabel("Show Slot Based View").check();
	await expect(page.getByRole("button", { name: "Add" }).nth(3)).toBeVisible();
	await expect(page.getByRole("heading", { name: "of Ancestral Echoes," }).first()).toBeVisible();
	await expect(page.getByRole("heading", { name: "of Ancestral Echoes," }).nth(1)).toBeVisible();
	await expect(page.getByRole("heading", { name: "of Ancestral Echoes," }).nth(2)).toBeVisible();
	await expect(page.getByText("60, 1H-Weapon")).toBeVisible();
	await page.getByRole("button", { name: "X" }).nth(1).click();
	await expect(page.getByText("60, 1H-Weapon")).toBeVisible({ timeout: 10000, visible: false });
	await expect(page.getByText("2, 1H-Weapon")).toBeVisible();
	await page.getByLabel("Show Slot Based View").uncheck();
	await page.getByLabel("Limit to owned").uncheck();
	await page.getByRole("button", { name: "X" }).nth(2).click();
	await page.getByRole("button", { name: "X" }).nth(1).click();
	await page.getByRole("button", { name: "X" }).click();
	await page.getByLabel("Limit to owned").check();
	await expect(page.getByRole("status")).toBeVisible();
	await page.getByLabel("Limit to owned").uncheck();
	await expect(page.locator("div:nth-child(16) > div:nth-child(5) > .text-center")).toBeVisible();
});
