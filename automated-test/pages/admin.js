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

  async settingRestaurant(restaurant) {
    await this.page.getByText("⚙️ Restaurant SettingsManage").click();
    await this.page.getByRole("button", { name: "✏️ Edit" }).click();

    await this.page.getByRole("textbox").first().fill(restaurant.name);
    await this.page.getByRole("textbox").nth(1).fill(restaurant.opening_hour);
    await this.page.getByRole("textbox").nth(2).fill(restaurant.closing_hour);
    await this.page.getByRole("textbox").nth(3).fill(restaurant.phone);
    await this.page.getByRole("textbox").nth(4).fill(restaurant.email);

    await this.page.getByRole("button", { name: "Save" }).scrollIntoViewIfNeeded();
    await this.page.getByRole("button", { name: "Save" }).click();
  }
}
