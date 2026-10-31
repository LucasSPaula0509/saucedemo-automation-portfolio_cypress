import { BasePage } from "../pages/base/BasePage";

const DOCUMENT_ALIAS = "documentResponse";

/**
 * Captura os cabeçalhos da resposta do documento principal apenas observando a navegação normal
 * (cy.intercept sem alterar nada): nenhuma requisição extra ou modificada.
 *
 * Restrito a Chrome/Edge para manter o mesmo escopo do projeto Java, que lia os cabeçalhos via
 * Chrome DevTools Protocol.
 */
class SecurityHeadersInspector extends BasePage {
  isSupported(): boolean {
    return Cypress.browser.family === "chromium";
  }

  /** Navega até path e devolve os cabeçalhos da resposta do documento (nomes em minúsculas). */
  documentResponseHeaders(path: string): Cypress.Chainable<Record<string, string>> {
    cy.intercept({ method: "GET", pathname: path, resourceType: "document" }).as(DOCUMENT_ALIAS);
    this.visitPath(path);
    return cy.wait(`@${DOCUMENT_ALIAS}`).then(({ response }) => {
      if (response === undefined) {
        throw new Error(`Resposta do documento não capturada: ${path}`);
      }
      return Object.fromEntries(
        Object.entries(response.headers)
          .map(([name, value]): [string, string] => [
            name.toLowerCase(),
            Array.isArray(value) ? value.join(", ") : value,
          ])
          .sort(([a], [b]) => a.localeCompare(b)),
      );
    });
  }
}

export const securityHeadersInspector = new SecurityHeadersInspector();
