import type { CartItemRow } from "../data/CartItemRow";
import { Paths } from "../data/Paths";
import { CartUi } from "../ui/CartUi";
import { BasePage, type LoadablePage } from "./base/BasePage";

class CartPage extends BasePage implements LoadablePage {
  readonly path = Paths.CART;

  marker(): Cypress.Chainable<JQuery> {
    return this.element(CartUi.CART_LIST);
  }

  items(): Cypress.Chainable<CartItemRow[]> {
    return this.textsOf(CartUi.ITEM_QUANTITIES).then((quantities) =>
      this.textsOf(CartUi.ITEM_NAMES).then((names) =>
        this.textsOf(CartUi.ITEM_PRICES).then((prices) =>
          names.map((name, i) => ({ quantity: quantities[i] ?? "", name, price: prices[i] ?? "" })),
        ),
      ),
    );
  }

  itemNames(): Cypress.Chainable<string[]> {
    return this.textsOf(CartUi.ITEM_NAMES);
  }

  remove(productName: string): void {
    this.click(CartUi.removeButton(productName));
  }

  checkout(): void {
    this.click(CartUi.CHECKOUT);
  }
}

export const cartPage = new CartPage();
