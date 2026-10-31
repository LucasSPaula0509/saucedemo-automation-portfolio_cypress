import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { PageTitles } from "../data/PageTitles";
import { actionButtons } from "../pages/ActionButtonsComponent";
import { feedback } from "../pages/FeedbackComponent";
import { header } from "../pages/HeaderComponent";
import { loginPage } from "../pages/LoginPage";
import { menu } from "../pages/MenuComponent";
import { productsPage } from "../pages/ProductsPage";
import { expectAbsent, expectLoaded, expectText } from "./Assertions";

/** Passos usados por mais de uma funcionalidade. */

When("ele aciona {string}", function (label: string) {
  actionButtons.press(label);
});

When("ele seleciona a opção {string} no menu lateral", function (option: string) {
  menu.open();
  menu.select(option);
});

When("ele seleciona a opção {string}", function (option: string) {
  menu.select(option);
});

Then("a mensagem {string} é exibida", function (message: string) {
  expectText(feedback.message(), "Mensagem exibida ao usuário", message);
});

Then("a página de produtos é exibida", function () {
  expectLoaded(productsPage, "Página de produtos carregada");
  expectText(header.pageTitle(), "Título da página", PageTitles.PRODUCTS);
});

Then("a página de login é exibida", function () {
  expectLoaded(loginPage, "Página de login carregada");
});

Then("o contador do carrinho exibe {string}", function (count: string) {
  expectText(header.cartBadgeText(), "Contador do carrinho", count);
});

Then("o contador do carrinho não é exibido", function () {
  expectAbsent(header.cartBadge());
});

Then("o botão do produto {string} exibe {string}", function (product: string, label: string) {
  expectText(productsPage.productButtonText(product), `Botão do produto '${product}'`, label);
});
