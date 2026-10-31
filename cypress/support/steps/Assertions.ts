import type { LoadablePage } from "../pages/base/BasePage";

/**
 * Asserções reutilizadas pelos steps. Todas usam should: o Cypress repete a leitura da page até a
 * asserção passar ou o defaultCommandTimeout acabar.
 */
export function expectLoaded(page: LoadablePage, description: string): void {
  page.marker().should("be.visible");
  page.currentPath().should((path) => {
    expect(path, description).to.equal(page.path);
  });
}

export function expectText(
  actual: Cypress.Chainable<string>,
  description: string,
  expected: string,
): void {
  actual.should((text) => {
    expect(text, description).to.equal(expected);
  });
}

/** Compara a lista (ou objeto) inteira de uma vez: a falha mostra todas as divergências. */
export function expectAll<T>(actual: Cypress.Chainable<T>, description: string, expected: T): void {
  actual.should((value) => {
    expect(value, description).to.deep.equal(expected);
  });
}

export function expectAbsent(element: Cypress.Chainable<JQuery>): void {
  element.should("not.exist");
}
