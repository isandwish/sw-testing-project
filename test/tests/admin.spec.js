import { test, expect } from "@playwright/test";
import { Page } from "../pages/admin";
import user from "../data/user.json";
import restaurant from "../data/restaurant.json";

test.describe('Admin Test', () => {

    test("FR-12/TC-01 Admin Manage Restaurant Information", async({ page }) => {
        const login = new Page(page);
        await login.goto();
        await login.login(user.admin.email, user.admin.pwd);

        await login.settingRestaurant(restaurant[1]);
        await expect(page.getByText(restaurant[1].name)).toBeVisible();
        await expect(page.getByText(restaurant[1].opening_hour)).toBeVisible();
        await expect(page.getByText(restaurant[1].closing_hour)).toBeVisible();
        await expect(page.getByText(restaurant[1].phone)).toBeVisible();
        await expect(page.getByText(restaurant[1].email)).toBeVisible();
    });

    test("FR-08/TC-01 Admin see all notification", async({ page }) => {
        const login = new Page(page);
        await login.goto();
        await login.login(user.admin.email, user.admin.pwd);

        await page.getByText("🔔 NotificationsReservation").click();
        await expect(page.getByText("CANCELLED").nth(1)).toBeVisible();
        await expect(page.getByText("CREATED").nth(1)).toBeVisible();
        await expect(page.getByText("UPDATED").nth(1)).toBeVisible();
    })
})