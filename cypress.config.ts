import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { defineConfig } from "cypress";

/**
 * Desativa o gerenciador de senhas e o alerta de "senha vazada" do Chrome/Edge, que abre um
 * diálogo nativo após o login no saucedemo e bloqueia as interações.
 */
const PASSWORD_MANAGER_PREFS = {
  credentials_enable_service: false,
  profile: {
    password_manager_enabled: false,
    password_manager_leak_detection: false,
  },
};

export default defineConfig({
  e2e: {
    // Sobrescrevível com CYPRESS_BASE_URL.
    baseUrl: "https://www.saucedemo.com",
    specPattern: "cypress/e2e/**/*.feature",
    supportFile: "cypress/support/e2e.ts",
    defaultCommandTimeout: 10_000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    testIsolation: true,
    retries: 0,
    video: false,
    screenshotOnRunFailure: true,
    expose: {
      // Filtro padrão (sobrescreva com --expose tags="...").
      tags: "not @defeito and not @performance",
    },
    // Sobrescrevíveis com cypress.env.json, --env chave=valor ou variáveis CYPRESS_<chave>.
    env: {
      screenshotEveryStep: false,
      // Performance (@performance) - limites em milissegundos.
      "perf.login.page.max.ms": 3000,
      "perf.login.to.inventory.max.ms": 2000,
      // Largest Contentful Paint: 2500 ms é o limite "bom" do Core Web Vitals.
      "perf.lcp.max.ms": 2500,
      // Segurança (@seguranca @passivo): true = achados reprovam o cenário; false = apenas registra.
      securityFailOnFindings: false,
    },
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on("file:preprocessor", createBundler({ plugins: [createEsbuildPlugin(config)] }));
      on("before:browser:launch", (browser, launchOptions) => {
        const { viewportWidth: width, viewportHeight: height } = config;
        if (browser.family === "chromium" && browser.name !== "electron") {
          Object.assign(launchOptions.preferences.default, PASSWORD_MANAGER_PREFS);
          launchOptions.args.push("--disable-search-engine-choice-screen");
          if (browser.isHeadless) {
            launchOptions.args.push(`--window-size=${width},${height}`);
          }
        } else if (browser.family === "firefox") {
          launchOptions.preferences["signon.rememberSignons"] = false;
          if (browser.isHeadless) {
            launchOptions.args.push(`--width=${width}`, `--height=${height}`);
          }
        }
        return launchOptions;
      });
      return config;
    },
  },
});
