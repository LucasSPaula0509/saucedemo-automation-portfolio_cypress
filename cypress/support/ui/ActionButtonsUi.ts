import { CartUi } from "./CartUi";
import { CheckoutCompleteUi } from "./CheckoutCompleteUi";
import { CheckoutInfoUi } from "./CheckoutInfoUi";
import { CheckoutOverviewUi } from "./CheckoutOverviewUi";
import { ProductDetailUi } from "./ProductDetailUi";

/**
 * Botões de navegação acionados pelo rótulo visível no Gherkin (ele aciona "Finish"). O mesmo
 * rótulo pode existir em mais de uma página (ex.: "Cancel"), mas o data-test é igual.
 */
const BUTTONS_BY_LABEL: Readonly<Record<string, string>> = {
  "Back to products": ProductDetailUi.BACK_TO_PRODUCTS,
  "Back Home": CheckoutCompleteUi.BACK_HOME,
  "Continue Shopping": CartUi.CONTINUE_SHOPPING,
  Checkout: CartUi.CHECKOUT,
  Continue: CheckoutInfoUi.CONTINUE,
  Cancel: CheckoutInfoUi.CANCEL,
  Finish: CheckoutOverviewUi.FINISH,
};

export const ActionButtonsUi = {
  byLabel(label: string): string {
    const selector = BUTTONS_BY_LABEL[label];
    if (selector === undefined) {
      throw new Error(
        `Botão sem locator mapeado: '${label}'. Mapeados: ${Object.keys(BUTTONS_BY_LABEL).join(", ")}`,
      );
    }
    return selector;
  },
} as const;
