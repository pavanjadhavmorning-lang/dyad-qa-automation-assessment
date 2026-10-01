import { Page } from "@playwright/test";

export class RegisterPage {
  private readonly firstName;
  private readonly lastName;
  private readonly address;
  private readonly city;
  private readonly state;
  private readonly zipCode;
  private readonly phoneNumber;
  private readonly ssn;
  private readonly username;
  private readonly password;
  private readonly confirmPassword;
  private readonly registerButton;

  constructor(private readonly page: Page) {
    this.firstName = page.locator('input[name="customer.firstName"]');
    this.lastName = page.locator('input[name="customer.lastName"]');
    this.address = page.locator('input[name="customer.address.street"]');
    this.city = page.locator('input[name="customer.address.city"]');
    this.state = page.locator('input[name="customer.address.state"]');
    this.zipCode = page.locator('input[name="customer.address.zipCode"]');
    this.phoneNumber = page.locator('input[name="customer.phoneNumber"]');
    this.ssn = page.locator('input[name="customer.ssn"]');
    this.username = page.locator('input[name="customer.username"]');
    this.password = page.locator('input[name="customer.password"]');
    this.confirmPassword = page.locator('input[name="repeatedPassword"]');
    this.registerButton = page.locator('input[value="Register"]');
  }

  async registerUser(data: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    ssn: string;
    username: string;
    password: string;
  }): Promise<void> {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.address.fill(data.address);
    await this.city.fill(data.city);
    await this.state.fill(data.state);
    await this.zipCode.fill(data.zipCode);
    await this.phoneNumber.fill(data.phoneNumber);
    await this.ssn.fill(data.ssn);
    await this.username.fill(data.username);
    await this.password.fill(data.password);
    await this.confirmPassword.fill(data.password);

    await this.registerButton.click();
  }
}
