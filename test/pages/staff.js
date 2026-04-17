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

  async tableOutOfService(table) {
      await this.page.getByText("👨‍🍳 Staff DashboardManage").click();
      await this.page.getByRole("button", { name: "Out" }).nth(table).click();
  }
}
