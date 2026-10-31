import { AfterStep, Before } from "@badeball/cypress-cucumber-preprocessor";
import * as allure from "allure-cypress";
import { resetWorld, type World } from "../world";
import { attachFailureContext, screenshot } from "./Evidence";
import { logToNode } from "./Logger";

const LOGGER = "Hooks";

/** Ciclo de vida do cenário: estado limpo, tags no Allure e evidências. */
Before({ name: "Preparação do cenário", order: 0 }, function (this: World, { pickle }) {
  resetWorld(this);
  allure.tags(...pickle.tags.map((tag) => tag.name.replace(/^@/, "")));
  logToNode(LOGGER, `Iniciando cenário: ${pickle.name}`);
});

/** Screenshot de cada passo, só com screenshotEveryStep=true (a falha já gera o próprio). */
if (String(Cypress.expose("screenshotEveryStep")) === "true") {
  AfterStep({ name: "Screenshot do passo" }, function ({ pickle }) {
    screenshot(`Passo - ${pickle.name}`);
  });
}

// afterEach do Mocha roda também quando o cenário falha (o After do Cucumber não roda).
afterEach(function () {
  const test = this.currentTest;
  const name = test?.title ?? "";
  if (test?.state === "failed") {
    attachFailureContext(name);
  }
  logToNode(LOGGER, `Cenário finalizado [${(test?.state ?? "unknown").toUpperCase()}]: ${name}`);
});
