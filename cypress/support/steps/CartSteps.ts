import { type DataTable, Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import type { CartItemRow } from "../data/CartItemRow";
import { browser } from "../pages/BrowserNavigation";
import { cartPage } from "../pages/CartPage";
import { header } from "../pages/HeaderComponent";
import { productDetailPage } from "../pages/ProductDetailPage";
import { productsPage } from "../pages/ProductsPage";
import type { World } from "../world";
import { expectAll } from "./Assertions";
import { loggedInOnProducts, loggedInWithEmptyCart, openCart, withCart } from "./ShopperJourney";

const NAME_COLUMN = "produto";
const QUANTITY_COLUMN = "quantidade";
const PRICE_COLUMN = "preco";

Given(
  "que o usuário {string} está na página de produtos com o carrinho vazio",
  function (this: World, username: string) {
    loggedInWithEmptyCart(this, username);
  },
);

Given(
  "que o carrinho do usuário {string} contém os produtos {string} e {string}",
  function (this: World, username: string, first: string, second: string) {
    withCart(this, username, [first, second]);
  },
);

Given(
  "que o carrinho do usuário {string} contém apenas o produto {string}",
  function (this: World, username: string, product: string) {
    withCart(this, username, [product]);
  },
);

Given(
  "que o carrinho do usuário {string} contém o produto {string}",
  function (this: World, username: string, product: string) {
    withCart(this, username, [product]);
  },
);

Given(
  "que o usuário {string} está no detalhe do produto {string} com o carrinho vazio",
  function (this: World, username: string, product: string) {
    loggedInWithEmptyCart(this, username);
    productsPage.openDetail(product);
  },
);

Given(
  "que o usuário {string} adicionou o produto {string} pela página de detalhe",
  function (this: World, username: string, product: string) {
    loggedInWithEmptyCart(this, username);
    productsPage.openDetail(product);
    productDetailPage.addToCart();
  },
);

Given(
  "que o usuário {string} adicionou os produtos {string} e {string}",
  function (this: World, username: string, first: string, second: string) {
    withCart(this, username, [first, second]);
  },
);

Given("que o usuário {string} está no carrinho", function (this: World, username: string) {
  loggedInOnProducts(this, username);
  openCart();
});

When("ele adiciona o produto {string} ao carrinho", function (product: string) {
  productsPage.addToCart(product);
});

When("ele adiciona ao carrinho os produtos", function (products: DataTable) {
  productsPage.addAllToCart(products.hashes().map((row) => row[NAME_COLUMN] ?? ""));
});

When("ele adiciona o produto ao carrinho", function () {
  productDetailPage.addToCart();
});

When("ele remove o produto {string} pela lista de produtos", function (product: string) {
  productsPage.removeFromCart(product);
});

When("ele volta para a lista de produtos", function () {
  productDetailPage.backToProducts();
});

When("ele acessa o carrinho", function () {
  header.openCart();
});

When("ele remove o produto {string} no carrinho", function (product: string) {
  openCart();
  cartPage.remove(product);
});

When("ele recarrega a página de produtos", function () {
  browser.refresh();
});

Then("o carrinho exibe os itens", function (expected: DataTable) {
  const expectedItems: CartItemRow[] = expected.hashes().map((row) => ({
    quantity: row[QUANTITY_COLUMN] ?? "",
    name: row[NAME_COLUMN] ?? "",
    price: row[PRICE_COLUMN] ?? "",
  }));
  expectAll(cartPage.items(), "Itens do carrinho", expectedItems);
});

Then("o carrinho exibe apenas o produto {string}", function (product: string) {
  expectAll(cartPage.itemNames(), "Produtos no carrinho", [product]);
});
