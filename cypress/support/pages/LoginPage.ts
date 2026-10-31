import { Passwords } from "../data/Passwords";
import { Paths } from "../data/Paths";
import { LoginUi } from "../ui/LoginUi";
import { BasePage, type LoadablePage } from "./base/BasePage";

class LoginPage extends BasePage implements LoadablePage {
  readonly path = Paths.LOGIN;

  visit(): void {
    this.visitPath(Paths.LOGIN);
  }

  login(username: string, password: string): void {
    this.type(LoginUi.USERNAME, username);
    this.type(LoginUi.PASSWORD, password);
    this.click(LoginUi.LOGIN_BUTTON);
  }

  /** Atalho reutilizável para pré-condições: abre a tela de login e autentica pela UI. */
  loginAs(username: string): void {
    this.visit();
    this.login(username, Passwords.DEFAULT);
  }

  typePassword(password: string): void {
    this.type(LoginUi.PASSWORD, password);
  }

  passwordFieldType(): Cypress.Chainable<string | undefined> {
    return this.attributeOf(LoginUi.PASSWORD, "type");
  }

  passwordFieldAutocomplete(): Cypress.Chainable<string | undefined> {
    return this.attributeOf(LoginUi.PASSWORD, "autocomplete");
  }

  marker(): Cypress.Chainable<JQuery> {
    return this.element(LoginUi.LOGIN_BUTTON);
  }
}

export const loginPage = new LoginPage();
