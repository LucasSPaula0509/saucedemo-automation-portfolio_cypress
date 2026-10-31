import { type DataTable, Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { PageTitles } from "../data/PageTitles";
import { Paths } from "../data/Paths";
import { Products } from "../data/Products";
import { actionButtons } from "../pages/ActionButtonsComponent";
import { browser } from "../pages/BrowserNavigation";
import { cartPage } from "../pages/CartPage";
import { checkoutInfoPage } from "../pages/CheckoutInfoPage";
import { checkoutOverviewPage } from "../pages/CheckoutOverviewPage";
import { header } from "../pages/HeaderComponent";
import { formatCents, parseCents } from "../utils/Money";
import { orderTotalsFromItemPrices } from "../utils/OrderTotals";
import type { World } from "../world";
import { expectAll, expectLoaded, expectText } from "./Assertions";
import {
  atCheckoutInformation,
  atCheckoutOverview,
  loggedInWithEmptyCart,
  openCart,
  withCheckoutInformationFilled,
} from "./ShopperJourney";

const DEFAULT_PRODUCTS = [Products.BACKPACK];
const FIELD_COLUMN = "campo";
const VALUE_COLUMN = "valor";

Given(
  "que o usuário {string} está no formulário de informações do checkout",
  function (this: World, username: string) {
    atCheckoutInformation(this, username, DEFAULT_PRODUCTS);
  },
);

Given(
  "que o usuário {string} preencheu os dados do checkout com o produto {string} no carrinho",
  function (this: World, username: string, product: string) {
    withCheckoutInformationFilled(this, username, [product]);
  },
);

Given(
  "que o usuário {string} preencheu os dados do checkout com os produtos {string} no carrinho",
  function (this: World, username: string, products: string) {
    withCheckoutInformationFilled(this, username, splitProducts(products));
  },
);

Given("que o usuário {string} está no resumo do pedido", function (this: World, username: string) {
  atCheckoutOverview(this, username, DEFAULT_PRODUCTS);
});

Given(
  "que o usuário {string} está no resumo do pedido com o produto {string}",
  function (this: World, username: string, product: string) {
    atCheckoutOverview(this, username, [product]);
  },
);

Given(
  "que o usuário {string} está na página {string}",
  function (this: World, username: string, pageTitle: string) {
    atCheckoutOverview(this, username, DEFAULT_PRODUCTS);
    checkoutOverviewPage.finish();
    expectText(header.pageTitle(), "Pré-condição: página atual", pageTitle);
  },
);

Given("que o usuário {string} está no carrinho vazio", function (this: World, username: string) {
  loggedInWithEmptyCart(this, username);
  openCart();
});

When("ele aciona {string} no carrinho", function (label: string) {
  openCart();
  actionButtons.press(label);
});

When(
  "ele continua informando nome {string}, sobrenome {string} e CEP {string}",
  function (firstName: string, lastName: string, postalCode: string) {
    checkoutInfoPage.submit({ firstName, lastName, postalCode });
  },
);

When("ele visualiza o resumo do pedido", function () {
  checkoutInfoPage.proceed();
});

Then("o formulário {string} é exibido", function (title: string) {
  expectLoaded(checkoutInfoPage, "Formulário do checkout carregado");
  expectText(header.pageTitle(), "Título da página", title);
});

Then("o resumo {string} é exibido", function (title: string) {
  expectLoaded(checkoutOverviewPage, "Resumo do pedido carregado");
  expectText(header.pageTitle(), "Título da página", title);
});

Then("o resumo exibe as informações", function (expected: DataTable) {
  const rows = expected.hashes();
  const fields = rows.map((row) => row[FIELD_COLUMN] ?? "");
  expectAll(
    checkoutOverviewPage
      .summaryInfo()
      .then((actual) => Object.fromEntries(fields.map((field) => [field, actual[field]]))),
    "Resumo do pedido",
    Object.fromEntries(rows.map((row) => [row[FIELD_COLUMN] ?? "", row[VALUE_COLUMN]])),
  );
});

Then(
  "o resumo exibe {string}, {string} e {string}",
  function (subtotal: string, tax: string, total: string) {
    checkoutOverviewPage.itemPrices().then((prices) => {
      const rule = orderTotalsFromItemPrices(prices);
      expectAll(displayedTotals(), "Resumo do pedido (exibido x esperado e regra de 8%)", {
        "Subtotal exibido": subtotal,
        "Imposto exibido": tax,
        "Total exibido": total,
        "Subtotal pela regra": formatCents(rule.subtotal),
        "Imposto pela regra de 8%": formatCents(rule.tax),
        "Total pela regra": formatCents(rule.total),
      });
    });
  },
);

Then("o carrinho é exibido", function () {
  expectLoaded(cartPage, "Carrinho carregado");
  expectText(header.pageTitle(), "Título da página", PageTitles.CART);
});

Then("o checkout não é iniciado", function () {
  browser.path().should((path) => {
    expect(path, "Página após acionar Checkout com o carrinho vazio").not.to.equal(
      Paths.CHECKOUT_STEP_ONE,
    );
  });
});

/** Valores exibidos no resumo, também convertidos para a mesma escala da regra de cálculo. */
function displayedTotals(): Cypress.Chainable<Record<string, string>> {
  return checkoutOverviewPage.subtotal().then((subtotal) =>
    checkoutOverviewPage.tax().then((tax) =>
      checkoutOverviewPage.total().then((total): Record<string, string> => ({
        "Subtotal exibido": subtotal,
        "Imposto exibido": tax,
        "Total exibido": total,
        "Subtotal pela regra": formatCents(parseCents(subtotal)),
        "Imposto pela regra de 8%": formatCents(parseCents(tax)),
        "Total pela regra": formatCents(parseCents(total)),
      })),
    ),
  );
}

function splitProducts(products: string): string[] {
  return products.split(",").map((product) => product.trim());
}
