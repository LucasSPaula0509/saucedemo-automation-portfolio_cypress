import { BasePage } from "../pages/base/BasePage";
import type { CookieAttributes } from "./CookieAttributes";

/** Valores do Cypress para SameSite, no formato do atributo do cookie ("no_restriction" = None). */
const SAME_SITE: Readonly<Record<string, string>> = {
  no_restriction: "None",
  lax: "Lax",
  strict: "Strict",
};

/** Lê cookies do navegador atual, sem enviar requisições ao site. */
class SessionCookieInspector extends BasePage {
  cookie(name: string): Cypress.Chainable<CookieAttributes | null> {
    return cy.getCookie(name).then((cookie) => cy.wrap(toAttributes(cookie), { log: false }));
  }
}

function toAttributes(cookie: Cypress.Cookie | null): CookieAttributes | null {
  if (cookie === null) {
    return null;
  }
  return {
    name: cookie.name,
    secure: cookie.secure,
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite === undefined ? null : (SAME_SITE[cookie.sameSite] ?? null),
  };
}

export const sessionCookieInspector = new SessionCookieInspector();
