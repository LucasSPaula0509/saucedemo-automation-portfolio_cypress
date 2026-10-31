/** Limites de performance (env do cypress.config.ts, sobrescrevíveis com --env / cypress.env.json). */
const LOGIN_PAGE_LOAD = "perf.login.page.max.ms";
const LOGIN_TO_INVENTORY = "perf.login.to.inventory.max.ms";
const LARGEST_CONTENTFUL_PAINT = "perf.lcp.max.ms";

export function loginPageLoadLimitMs(): Cypress.Chainable<number> {
  return millis(LOGIN_PAGE_LOAD);
}

export function loginToInventoryLimitMs(): Cypress.Chainable<number> {
  return millis(LOGIN_TO_INVENTORY);
}

export function largestContentfulPaintLimitMs(): Cypress.Chainable<number> {
  return millis(LARGEST_CONTENTFUL_PAINT);
}

function millis(key: string): Cypress.Chainable<number> {
  return cy.env([key], { log: false }).then((env) => Number(env[key]));
}
