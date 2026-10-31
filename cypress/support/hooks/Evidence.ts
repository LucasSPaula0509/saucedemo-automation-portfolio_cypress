import * as allure from "allure-cypress";
import { browserConsoleLogs } from "./BrowserConsole";

/** Anexa ao Allure o contexto do navegador no momento da falha: URL, HTML e console. */
export function attachFailureContext(scenarioName: string): void {
  const suffix = ` - ${scenarioName}`;
  cy.url({ log: false }).then((url) => {
    allure.attachment(`URL${suffix}`, url, "text/uri-list");
  });
  cy.document({ log: false }).then((document) => {
    allure.attachment(`HTML${suffix}`, document.documentElement.outerHTML, "text/html");
  });
  cy.then(() => {
    allure.attachment(`Console do navegador${suffix}`, browserConsoleLogs(), "text/plain");
  });
}

export function screenshot(name: string): void {
  cy.screenshot(name, { log: false });
}
