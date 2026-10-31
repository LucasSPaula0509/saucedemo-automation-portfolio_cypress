import { HeaderUi } from "../ui/HeaderUi";
import { MenuUi } from "../ui/MenuUi";
import { BasePage } from "./base/BasePage";

/** Menu lateral (hambúrguer) disponível em todas as páginas autenticadas. */
class MenuComponent extends BasePage {
  open(): void {
    this.click(HeaderUi.MENU_BUTTON);
  }

  visibleOptions(): Cypress.Chainable<string[]> {
    return this.textsOf(MenuUi.OPTIONS);
  }

  select(option: string): void {
    this.click(MenuUi.option(option));
  }
}

export const menu = new MenuComponent();
