import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { MenuOptions } from "../data/MenuOptions";
import { browser } from "../pages/BrowserNavigation";
import { loginPage } from "../pages/LoginPage";
import { menu } from "../pages/MenuComponent";
import { currentUsername, type World } from "../world";
import { expectLoaded } from "./Assertions";
import { loggedInOnProducts } from "./ShopperJourney";

const MASKED_INPUT_TYPE = "password";

Given("que o usuário {string} está na página de login", function (this: World, username: string) {
  this.username = username;
  loginPage.visit();
});

Given("que o visitante está na página de login", function () {
  loginPage.visit();
});

/** Cada cenário começa com sessão limpa (testIsolation: true), sem cookies nem storage. */
Given("que o visitante não está autenticado", function () {
  // Nada a fazer: o isolamento entre cenários já garante a sessão anônima.
});

Given("que o usuário {string} está autenticado", function (this: World, username: string) {
  loggedInOnProducts(this, username);
});

Given(
  "que o usuário {string} encerrou a sessão pelo menu lateral",
  function (this: World, username: string) {
    loggedInOnProducts(this, username);
    menu.open();
    menu.select(MenuOptions.LOGOUT);
    expectLoaded(loginPage, "Pré-condição: logout concluído");
  },
);

When("ele se autentica com a senha {string}", function (this: World, password: string) {
  loginPage.login(currentUsername(this), password);
});

When(
  "ele tenta se autenticar com usuário {string} e senha {string}",
  function (username: string, password: string) {
    loginPage.login(username, password);
  },
);

When("ele digita a senha {string}", function (password: string) {
  loginPage.typePassword(password);
});

When("ele acessa diretamente a página {string}", function (path: string) {
  browser.openPath(path);
});

When("ele tenta retornar à página de produtos pelo histórico do navegador", function () {
  browser.back();
});

Then("o conteúdo do campo de senha é exibido mascarado", function () {
  loginPage.passwordFieldType().should((type) => {
    expect(type, "Atributo 'type' do campo de senha").to.equal(MASKED_INPUT_TYPE);
  });
});
