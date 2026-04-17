export class Page {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("http://localhost:3000/login");
  }

  async login(email, password) {
    await this.page.getByRole("textbox", { name: "Email" }).fill(email);
    await this.page.getByRole("textbox", { name: "Password" }).fill(password);
    await this.page.getByRole("button", { name: "Login" }).click();
  }

  async getError() {
    return this.page.locator(".error-message");
  }

  async inputData(booking) {
    await this.page.locator('input[type="date"]').fill(booking.date);
    await this.page.locator('input[type="time"]').fill(booking.time);
    await this.page.getByPlaceholder("Guest count").fill(booking.guest);
  }

  async check_availability(booking) {
    await this.page.getByText("📅 Check AvailabilitySee").click();
    await this.inputData(booking)
    await this.page.getByRole("button", { name: "Check Availability" }).click();
  }

  async reservation(booking) {
    await this.page.getByText("🍽 Make ReservationBook a").click();
    await this.inputData(booking);
    await this.page.getByRole('textbox', { name: 'Special request (optional)' }).fill(booking.request);
    await this.page.getByRole("button", { name: "Check Availability" }).click();
  }

  async edit(booking) {
    await this.page.locator('input[type="date"]').fill(booking.date);
    await this.page.locator('input[type="time"]').fill(booking.time);
    await this.page.getByRole("spinbutton").fill(booking.guest);
    await this.page.getByRole("button", { name: "Save" }).click();
  }
}
