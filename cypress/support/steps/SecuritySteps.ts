import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import * as allure from "allure-cypress";
import { Cookies } from "../data/Cookies";
import { Paths } from "../data/Paths";
import { browser } from "../pages/BrowserNavigation";
import { loginPage } from "../pages/LoginPage";
import { cookieAttributesToJson } from "../security/CookieAttributes";
import { securityHeadersInspector } from "../security/SecurityHeadersInspector";
import { sessionCookieInspector } from "../security/SessionCookieInspector";
import { logToNode } from "../utils/Logger";
import { capturedResponseHeaders, type World } from "../world";

/**
 * Verificações passivas: só leem o que o navegador já recebeu numa navegação normal. Achados são
 * anexados ao Allure e só reprovam o cenário com securityFailOnFindings=true.
 */
const LOGGER = "SecuritySteps";
const FAIL_ON_FINDINGS = "securityFailOnFindings";
const ADEQUATE_PASSWORD_AUTOCOMPLETE = ["current-password", "new-password", "off"];

When("o visitante acessa o site pelo protocolo HTTP", function () {
  browser.openOverHttp();
});

Then("a página é servida via HTTPS", function () {
  browser.url().should((url) => {
    expect(url, "URL após acessar via HTTP").to.match(/^https:\/\//);
  });
});

Then("os atributos Secure, HttpOnly e SameSite do cookie de sessão são verificados", function () {
  sessionCookieInspector.cookie(Cookies.SESSION).then((cookie) => {
    expect(cookie, `Cookie de sessão '${Cookies.SESSION}'`).not.to.equal(null);
    if (cookie === null) {
      return;
    }
    const findings: string[] = [];
    if (!cookie.secure) {
      findings.push(`Cookie '${cookie.name}' sem o atributo Secure`);
    }
    if (!cookie.httpOnly) {
      findings.push(`Cookie '${cookie.name}' sem o atributo HttpOnly`);
    }
    if (cookie.sameSite === null || cookie.sameSite.toLowerCase() === "none") {
      findings.push(`Cookie '${cookie.name}' com SameSite ${cookie.sameSite ?? "ausente"}`);
    }
    report("Cookie de sessão", cookieAttributesToJson(cookie), findings);
  });
});

Then("o atributo autocomplete do campo de senha é verificado", function () {
  loginPage.passwordFieldAutocomplete().then((autocomplete) => {
    const findings: string[] = [];
    if (
      autocomplete === undefined ||
      !ADEQUATE_PASSWORD_AUTOCOMPLETE.includes(autocomplete.trim())
    ) {
      findings.push(
        `Campo de senha com autocomplete ${autocomplete === undefined ? "ausente" : `"${autocomplete}"`} (esperado: ${ADEQUATE_PASSWORD_AUTOCOMPLETE.join(", ")})`,
      );
    }
    report("Autocomplete do campo de senha", `autocomplete=${autocomplete ?? "null"}`, findings);
  });
});

When(
  "o visitante abre a página de login registrando os cabeçalhos da resposta",
  function (this: World) {
    if (!securityHeadersInspector.isSupported()) {
      logToNode(
        LOGGER,
        `Cenário pulado: cabeçalhos exigem Chrome ou Edge (navegador atual: ${Cypress.browser.name})`,
      );
      return "skipped";
    }
    securityHeadersInspector.documentResponseHeaders(Paths.LOGIN).then((headers) => {
      this.responseHeaders = headers;
    });
    return undefined;
  },
);

Then("os cabeçalhos de segurança da resposta são verificados", function (this: World) {
  const headers = capturedResponseHeaders(this);
  const findings: string[] = [];
  if (!("content-security-policy" in headers)) {
    findings.push("Cabeçalho Content-Security-Policy ausente");
  }
  if (
    !("x-frame-options" in headers) &&
    !(headers["content-security-policy"] ?? "").includes("frame-ancestors")
  ) {
    findings.push("Proteção contra clickjacking ausente (X-Frame-Options ou CSP frame-ancestors)");
  }
  if ((headers["x-content-type-options"] ?? "").trim().toLowerCase() !== "nosniff") {
    findings.push("Cabeçalho X-Content-Type-Options diferente de 'nosniff' ou ausente");
  }
  if (!("strict-transport-security" in headers)) {
    findings.push("Cabeçalho Strict-Transport-Security (HSTS) ausente");
  }
  const evidence = Object.entries(headers)
    .map(([name, value]) => `${name}: ${value}`)
    .join("\n");
  report("Cabeçalhos de segurança", evidence, findings);
});

function report(check: string, evidence: string, findings: readonly string[]): void {
  allure.attachment(`${check} - evidência`, evidence, "text/plain");
  allure.attachment(
    `${check} - achados`,
    findings.length === 0 ? "Nenhum achado" : findings.join("\n"),
    "text/plain",
  );
  findings.forEach((finding) => {
    logToNode(LOGGER, `Achado de segurança [${check}]: ${finding}`, "WARN");
  });
  cy.env([FAIL_ON_FINDINGS], { log: false }).then((env) => {
    if (String(env[FAIL_ON_FINDINGS]) === "true") {
      expect(findings, `Achados de segurança - ${check}`).to.deep.equal([]);
    }
  });
}
