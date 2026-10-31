import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import * as allure from "allure-cypress";
import { loginPage } from "../pages/LoginPage";
import { productsPage } from "../pages/ProductsPage";
import { navigationMetricsToJson } from "../performance/NavigationMetrics";
import { navigationMetricsCollector } from "../performance/NavigationMetricsCollector";
import {
  largestContentfulPaintLimitMs,
  loginPageLoadLimitMs,
  loginToInventoryLimitMs,
} from "../performance/PerformanceLimits";
import {
  currentUsername,
  measuredLoginToInventoryMs,
  measuredNavigation,
  type World,
} from "../world";

When("o visitante abre a página de login medindo o carregamento", function (this: World) {
  loginPage.visit();
  navigationMetricsCollector.collect().then((metrics) => {
    this.navigation = metrics;
    allure.attachment(
      "Métricas de navegação - login",
      navigationMetricsToJson(metrics),
      "application/json",
    );
  });
});

/**
 * Tempo percebido do clique em Login até a lista de produtos visível, medido pelo teste (inclui a
 * latência do Cypress, por isso o limite é folgado).
 */
When(
  "ele se autentica com a senha {string} medindo o tempo até a página de produtos",
  function (this: World, password: string) {
    const username = currentUsername(this);
    let start = 0;
    cy.then(() => {
      start = performance.now();
    });
    loginPage.login(username, password);
    productsPage.marker().should("be.visible");
    cy.then(() => {
      this.loginToInventoryMs = Math.round(performance.now() - start);
    });
    loginToInventoryLimitMs().then((limitMs) => {
      allure.attachment(
        "Tempo do login até a página de produtos",
        JSON.stringify(
          {
            usuario: username,
            tempoMs: measuredLoginToInventoryMs(this),
            limiteMs: limitMs,
            paginaDeProdutosExibida: true,
          },
          null,
          2,
        ),
        "application/json",
      );
    });
  },
);

Then("a página de login carrega dentro do limite configurado", function (this: World) {
  loginPageLoadLimitMs().then((limitMs) => {
    expect(measuredNavigation(this).loadMs, "Carregamento da página de login (ms)").to.be.at.most(
      limitMs,
    );
  });
});

Then("o Largest Contentful Paint fica dentro do limite configurado", function (this: World) {
  largestContentfulPaintLimitMs().then((limitMs) => {
    const { lcpMs } = measuredNavigation(this);
    expect(lcpMs, "Largest Contentful Paint (ms) disponível no navegador").to.be.a("number");
    expect(lcpMs, "Largest Contentful Paint (ms)").to.be.at.most(limitMs);
  });
});

Then("o tempo até a página de produtos fica dentro do limite configurado", function (this: World) {
  loginToInventoryLimitMs().then((limitMs) => {
    expect(
      measuredLoginToInventoryMs(this),
      "Tempo do login até a página de produtos (ms)",
    ).to.be.at.most(limitMs);
  });
});

Then(
  "o tempo até a página de produtos é sinalizado como acima do limite configurado",
  function (this: World) {
    loginToInventoryLimitMs().then((limitMs) => {
      expect(
        measuredLoginToInventoryMs(this),
        "Tempo do login até a página de produtos (ms, usuário com lentidão)",
      ).to.be.above(limitMs);
    });
  },
);
