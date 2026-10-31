import type { TextLocator } from "../../ui/DataTest";

/**
 * Página que sabe dizer se está carregada: um elemento característico e o caminho da URL. Os steps
 * validam os dois com retry (as pages não fazem asserções).
 */
export interface LoadablePage {
  readonly path: string;
  marker(): Cypress.Chainable<JQuery>;
  currentPath(): Cypress.Chainable<string>;
}

/**
 * Ações e leituras de estado reutilizadas por todos os Page Objects. As esperas são as nativas do
 * Cypress (retry até defaultCommandTimeout); por isso não existem métodos de espera.
 *
 * As leituras devolvem Chainables de consulta (get/invoke): quando o step encadeia um should, o
 * Cypress repete a leitura inteira até a asserção passar ou o tempo acabar.
 */
export abstract class BasePage {
  protected visitPath(path: string): void {
    cy.visit(path, { failOnStatusCode: false });
  }

  protected click(selector: string): void {
    cy.get(selector).click();
  }

  protected clickText(locator: TextLocator): void {
    cy.contains(locator.selector, locator.text).click();
  }

  /** Limpa o campo e digita o texto. Texto vazio mantém o campo vazio. */
  protected type(selector: string, text: string): void {
    cy.get(selector).clear();
    if (text !== "") {
      cy.get(selector).type(text);
    }
  }

  protected selectByVisibleText(selector: string, option: string): void {
    cy.get(selector).select(option);
  }

  protected element(selector: string): Cypress.Chainable<JQuery> {
    return cy.get(selector);
  }

  protected textOf(selector: string): Cypress.Chainable<string> {
    return cy.get(selector).invoke("text").invoke("trim");
  }

  protected textsOf(selector: string): Cypress.Chainable<string[]> {
    return cy
      .get(selector)
      .invoke("toArray")
      .invoke("map", (element: HTMLElement) => element.textContent.trim());
  }

  protected attributeOf(
    selector: string,
    attribute: string,
  ): Cypress.Chainable<string | undefined> {
    return cy.get(selector).invoke("attr", attribute);
  }

  currentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  currentPath(): Cypress.Chainable<string> {
    return cy.location("pathname");
  }
}
