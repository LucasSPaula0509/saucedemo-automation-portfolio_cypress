import { BasePage } from "./base/BasePage";

/** Ações do próprio navegador: acesso direto por URL, histórico e recarregamento. */
class BrowserNavigation extends BasePage {
  openPath(path: string): void {
    this.visitPath(path);
  }

  refresh(): void {
    cy.reload();
  }

  back(): void {
    cy.go("back");
  }

  /** Acessa a raiz do site pelo protocolo HTTP (sem TLS), para verificar o redirecionamento. */
  openOverHttp(): void {
    cy.visit(`http://${new URL(Cypress.config("baseUrl") ?? "").host}/`);
  }

  url(): Cypress.Chainable<string> {
    return this.currentUrl();
  }

  path(): Cypress.Chainable<string> {
    return this.currentPath();
  }

  /** URL atual depois que a navegação saiu para outro domínio (links externos). */
  externalSiteUrl(origin: string): Cypress.Chainable<string> {
    return cy.origin<string>(origin, () => {
      cy.url();
    });
  }
}

export const browser = new BrowserNavigation();
