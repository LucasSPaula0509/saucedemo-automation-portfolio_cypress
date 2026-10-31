import { Paths } from "../data/Paths";
import { CheckoutOverviewUi } from "../ui/CheckoutOverviewUi";
import { BasePage, type LoadablePage } from "./base/BasePage";

class CheckoutOverviewPage extends BasePage implements LoadablePage {
  readonly path = Paths.CHECKOUT_STEP_TWO;

  marker(): Cypress.Chainable<JQuery> {
    return this.element(CheckoutOverviewUi.SUMMARY_CONTAINER);
  }

  /**
   * Blocos informativos do resumo (pagamento e entrega), indexados pelo rótulo sem os dois-pontos
   * finais exibidos na tela (ex.: "Payment Information:" → "Payment Information").
   */
  summaryInfo(): Cypress.Chainable<Record<string, string>> {
    const { PAYMENT_INFO_LABEL, PAYMENT_INFO_VALUE, SHIPPING_INFO_LABEL, SHIPPING_INFO_VALUE } =
      CheckoutOverviewUi;
    return this.info(PAYMENT_INFO_LABEL, PAYMENT_INFO_VALUE).then((payment) =>
      this.info(SHIPPING_INFO_LABEL, SHIPPING_INFO_VALUE).then((shipping) => ({
        ...payment,
        ...shipping,
      })),
    );
  }

  itemPrices(): Cypress.Chainable<string[]> {
    return this.textsOf(CheckoutOverviewUi.ITEM_PRICES);
  }

  subtotal(): Cypress.Chainable<string> {
    return this.textOf(CheckoutOverviewUi.SUBTOTAL);
  }

  tax(): Cypress.Chainable<string> {
    return this.textOf(CheckoutOverviewUi.TAX);
  }

  total(): Cypress.Chainable<string> {
    return this.textOf(CheckoutOverviewUi.TOTAL);
  }

  finish(): void {
    this.click(CheckoutOverviewUi.FINISH);
  }

  private info(label: string, value: string): Cypress.Chainable<Record<string, string>> {
    return this.textOf(label).then((labelText) =>
      this.textOf(value).then((valueText) => ({ [labelText.replace(/:\s*$/, "")]: valueText })),
    );
  }
}

export const checkoutOverviewPage = new CheckoutOverviewPage();
