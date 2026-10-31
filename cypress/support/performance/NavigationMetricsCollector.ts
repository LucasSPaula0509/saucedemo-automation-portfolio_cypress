import { BasePage } from "../pages/base/BasePage";
import type { NavigationMetrics } from "./NavigationMetrics";

const LCP_ENTRY_TYPE = "largest-contentful-paint";

/**
 * Lê as métricas da navegação atual direto do navegador (window.performance), sem gerar
 * requisições extras ao site. O cy.visit só termina após o evento load, então o Navigation Timing
 * já está completo quando a coleta roda.
 */
class NavigationMetricsCollector extends BasePage {
  collect(): Cypress.Chainable<NavigationMetrics> {
    return cy
      .window({ log: false })
      .its("performance")
      .invoke("getEntriesByType", "navigation")
      .its(0)
      .then((entry) => {
        const nav = entry as PerformanceNavigationTiming;
        return this.largestContentfulPaint().then((lcpMs) => ({
          url: nav.name,
          timeToFirstByteMs: nav.responseStart - nav.startTime,
          domContentLoadedMs: nav.domContentLoadedEventEnd - nav.startTime,
          loadMs: nav.loadEventEnd - nav.startTime,
          lcpMs,
        }));
      });
  }

  /**
   * LCP só é exposto via PerformanceObserver; buffered: true entrega as entradas já registradas.
   * Sem suporte no navegador, devolve null.
   */
  private largestContentfulPaint(): Cypress.Chainable<number | null> {
    return cy.window({ log: false }).then(
      (win) =>
        new Cypress.Promise<number | null>((resolve) => {
          if (!win.PerformanceObserver.supportedEntryTypes.includes(LCP_ENTRY_TYPE)) {
            resolve(null);
            return;
          }
          new win.PerformanceObserver((list) => {
            resolve(list.getEntries().at(-1)?.startTime ?? null);
          }).observe({ type: LCP_ENTRY_TYPE, buffered: true });
        }),
    );
  }
}

export const navigationMetricsCollector = new NavigationMetricsCollector();
