import { test, expect } from "@playwright/test";
import { Page } from "../pages/staff";
import user from "../data/user.json";


test.describe("Staff Test", () => {
    test("FR-09/TC-03 - Staff change table status to Out of service ", async ({ page }) => {
        const login = new Page(page);
        await login.goto();
        await login.login(user.staff.email, user.staff.pwd);

        await login.tableOutOfService(1)
        await expect(page.getByText("OUT_OF_SERVICE")).toBeVisible();
    })
})