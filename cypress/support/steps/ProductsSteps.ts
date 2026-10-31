import { type DataTable, Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import type { ProductRow } from "../data/ProductRow";
import { actionButtons } from "../pages/ActionButtonsComponent";
import { browser } from "../pages/BrowserNavigation";
import { menu } from "../pages/MenuComponent";
import { productDetailPage } from "../pages/ProductDetailPage";
import { productsPage } from "../pages/ProductsPage";
import type { World } from "../world";
import { expectAll, expectLoaded, expectText } from "./Assertions";
import { loggedInOnProducts } from "./ShopperJourney";

const NAME_COLUMN = "produto";
const PRICE_COLUMN = "preco";
const OPTION_COLUMN = "opcao";

Given(
  "que o usuário {string} está na página de produtos",
  function (this: World, username: string) {
    loggedInOnProducts(this, username);
  },
);

Given(
  "que o usuário {string} ordenou os produtos por {string}",
  function (this: World, username: string, sortOption: string) {
    loggedInOnProducts(this, username);
    productsPage.sortBy(sortOption);
  },
);

Given(
  "que o usuário {string} está no detalhe do produto {string}",
  function (this: World, username: string, product: string) {
    loggedInOnProducts(this, username);
    productsPage.openDetail(product);
  },
);

Given(
  "que o usuário {string} está com o menu lateral aberto",
  function (this: World, username: string) {
    loggedInOnProducts(this, username);
    menu.open();
  },
);

When("ele acessa a página de produtos", function () {
  productsPage.visit();
});

When("ele ordena os produtos por {string}", function (sortOption: string) {
  productsPage.sortBy(sortOption);
});

When(
  "ele abre o detalhe de um produto e volta para a lista com {string}",
  function (backButtonLabel: string) {
    productsPage.productNames().then((names) => {
      const [first] = names;
      if (first === undefined) {
        throw new Error("Nenhum produto exibido na lista");
      }
      productsPage.openDetail(first);
    });
    actionButtons.press(backButtonLabel);
  },
);

When("ele abre o detalhe do produto {string}", function (product: string) {
  productsPage.openDetail(product);
});

When("ele abre o menu lateral", function () {
  menu.open();
});

Then("os produtos são exibidos com nome e preço", function (expected: DataTable) {
  expectProductListMatches(expected);
});

Then("os produtos são exibidos na ordem", function (expected: DataTable) {
  expectProductListMatches(expected);
});

Then("a ordenação {string} está selecionada", function (sortOption: string) {
  expectText(productsPage.activeSort(), "Ordenação selecionada", sortOption);
});

Then(
  "o detalhe exibe o nome {string} com o preço {string}",
  function (name: string, price: string) {
    expectLoaded(productDetailPage, "Página de detalhe carregada");
    expectAll(
      productDetailPage
        .name()
        .then((actualName) =>
          productDetailPage
            .price()
            .then((actualPrice) => ({ nome: actualName, preco: actualPrice })),
        ),
      "Detalhe do produto",
      { nome: name, preco: price },
    );
  },
);

Then("as opções do menu são exibidas", function (expected: DataTable) {
  const expectedOptions = expected.hashes().map((row) => row[OPTION_COLUMN] ?? "");
  expectAll(menu.visibleOptions(), "Opções do menu lateral", expectedOptions);
});

Then("o site {string} é exibido", function (url: string) {
  expectText(browser.externalSiteUrl(new URL(url).origin), "URL do site externo", url);
});

/**
 * Compara a lista completa e ordenada. A coluna de preço só é verificada quando presente na
 * tabela do cenário. Todas as divergências são reportadas de uma vez.
 */
function expectProductListMatches(expected: DataTable): void {
  const rows = expected.hashes();
  const checkPrices = expected.raw()[0]?.includes(PRICE_COLUMN) ?? false;
  const toComparable = (row: ProductRow): Partial<ProductRow> =>
    checkPrices ? row : { name: row.name };
  const expectedRows = rows.map((row) =>
    toComparable({ name: row[NAME_COLUMN] ?? "", price: row[PRICE_COLUMN] ?? "" }),
  );
  expectAll(
    productsPage.products().then((actual) => actual.map(toComparable)),
    "Produtos exibidos (posição, nome e preço)",
    expectedRows,
  );
}
