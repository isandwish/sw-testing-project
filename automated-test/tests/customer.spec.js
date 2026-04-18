import { test, expect } from "@playwright/test";
import { Page } from "../pages/customer";
import user from "../data/user.json";
import booking from "../data/reservation.json";

test.describe("Customer Test", () => {
  
  test("FR-02/TC-01 - Valid login", async ({ page }) => {
    const login = new Page(page);
    await login.goto();
    await login.login(user.customer.email, user.customer.pwd);

    await expect(page.getByText("🍽 Make ReservationBook a")).toBeVisible();
    await expect(page.getByText("📋 My ReservationsView and")).toBeVisible();
    await expect(page.getByText("📅 Check AvailabilitySee")).toBeVisible();
  });

  test("FR-03/TC-02 - System show table", async ({ page }) => {
    const login = new Page(page);
    await login.goto();
    await login.login(user.customer.email, user.customer.pwd);
    await login.check_availability(booking.customer_01);

    await expect(page.getByText("Available TablesTable #")).toBeVisible();
  });

  test("FR-04/TC-02 - Customer make reservation will all field", async ({
    page,
  }) => {
    const login = new Page(page);
    await login.goto();
    await login.login(user.customer.email, user.customer.pwd);
    await login.reservation(booking.customer_01);

    await login.page
      .getByRole("button", { name: "Check Availability" })
      .click();
    await login.page.getByText("Table #2Capacity:").click();
    await login.page
      .getByRole("button", { name: "Confirm Reservation" })
      .click();

    await expect(page.getByText("Reservation successful 🎉")).toBeVisible();
  });

  test("FR-10/TC-02 - Cutomer make another reservation", async ({ page }) => {
    const login = new Page(page);
    await login.goto();
    await login.login(user.customer.email, user.customer.pwd);
    await login.reservation(booking.customer_02);

    await login.page
      .getByRole("button", { name: "Check Availability" })
      .click();
    await login.page.getByText("Table #2Capacity:").click();
    await login.page
      .getByRole("button", { name: "Confirm Reservation" })
      .click();

    await expect(page.getByText("Reservation successful 🎉")).toBeVisible();
  })

  test("FR-05/TC-02 - System show all customer reservation", async ({
    page,
  }) => {
    const login = new Page(page);
    await login.goto();
    await login.login(user.customer.email, user.customer.pwd);

    await page.getByText("📋 My ReservationsView and").click();
    await expect(
      page.getByText(
        "Table #2📅 " +
          booking.customer_01.date +
          " ⏰ " +
          booking.customer_01.time,
      ),
    ).toBeVisible();
  });

  test("FR-07/TC-01 - Customer cancel reservation", async ({ page }) => {
    const login = new Page(page);
    await login.goto();
    await login.login(user.customer.email, user.customer.pwd);

    await page.getByText("📋 My ReservationsView and").click();

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Delete this reservation?");
      await dialog.accept();
    });
    await page.getByRole("button", { name: "Delete" }).first().click();

    await expect(
      page.getByText(
        "Table #2📅 " +
          booking.customer_01.date +
          " ⏰ " +
          booking.customer_01.time,
      ),
    ).toBeHidden();
  });

  test("FR-06/TC-01 - Customer edit reservation", async ({ page }) => {
    const login = new Page(page);
    await login.goto();
    await login.login(user.customer.email, user.customer.pwd);

    await page.getByText("📋 My ReservationsView and").click();
    await page.getByRole("button", { name: "Edit" }).click();
    await login.edit(booking.customer_03)
    await expect(
      page.getByText(
        "Table #1📅 " +
          booking.customer_03.date +
          " ⏰ " +
          booking.customer_03.time,
      ),
    ).toBeVisible();
  });

});
