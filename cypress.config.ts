import {
  addCucumberPreprocessorPlugin,
  afterRunHandler,
  afterScreenshotHandler,
  afterSpecHandler,
} from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { allureCypress } from "allure-cypress/reporter";
import { defineConfig } from "cypress";
import { copyFileSync, mkdirSync } from "node:fs";
import { allureResultEnricher } from "./allure/AllureResultEnricher";
import { writeAllureEnvironment } from "./allure/environment";
import { ALLURE_LINKS } from "./allure/links";
import { log } from "./cypress/tasks/log";
import { renameFailureScreenshot } from "./cypress/tasks/screenshots";

const ALLURE_RESULTS = "allure-results";

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
    // Configuração pública lida no carregamento dos specs (sobrescreva com --expose chave=valor).
    expose: {
      // Filtro padrão de tags.
      tags: "not @defeito and not @performance",
      // true = screenshot ao fim de cada passo (a falha sempre gera o seu).
      screenshotEveryStep: false,
    },
    // Sobrescrevíveis com cypress.env.json, --env chave=valor ou variáveis CYPRESS_<chave>.
    env: {
      // Performance (@performance) - limites em milissegundos.
      "perf.login.page.max.ms": 3000,
      "perf.login.to.inventory.max.ms": 2000,
      // Largest Contentful Paint: 2500 ms é o limite "bom" do Core Web Vitals.
      "perf.lcp.max.ms": 2500,
      // Segurança (@seguranca @passivo): true = achados reprovam o cenário; false = apenas registra.
      securityFailOnFindings: false,
    },
    async setupNodeEvents(on, config) {
      // O navegador só é conhecido no lançamento; o Allure o usa no parâmetro "Navegador".
      let browser: Cypress.Browser | undefined;

      // O Cypress aceita um único handler por evento: after:spec, after:run e after:screenshot
      // repassam o evento ao Cucumber e ao Allure.
      await addCucumberPreprocessorPlugin(on, config, {
        omitAfterSpecHandler: true,
        omitAfterRunHandler: true,
        omitAfterScreenshotHandler: true,
      });
      on("file:preprocessor", createBundler({ plugins: [createEsbuildPlugin(config)] }));
      on("task", { log });

      const allure = allureCypress(on, config, {
        resultsDir: ALLURE_RESULTS,
        links: ALLURE_LINKS,
        listeners: [allureResultEnricher(() => browser?.name ?? "desconhecido")],
      });
      on("after:screenshot", (details) =>
        afterScreenshotHandler(config, renameFailureScreenshot(details)),
      );
      on("after:spec", async (spec, results) => {
        allure.onAfterSpec(spec, results);
        await afterSpecHandler(config, spec, results);
      });
      on("after:run", async (results) => {
        allure.onAfterRun(results);
        writeAllureEnvironment(ALLURE_RESULTS, config, browser);
        mkdirSync(ALLURE_RESULTS, { recursive: true });
        copyFileSync("allure/categories.json", `${ALLURE_RESULTS}/categories.json`);
        await afterRunHandler(config, results);
      });

      on("before:browser:launch", (launched, launchOptions) => {
        browser = launched;
        const { viewportWidth: width, viewportHeight: height } = config;
        if (launched.family === "chromium" && launched.name !== "electron") {
          Object.assign(launchOptions.preferences.default, PASSWORD_MANAGER_PREFS);
          launchOptions.args.push("--disable-search-engine-choice-screen");
          if (launched.isHeadless) {
            launchOptions.args.push(`--window-size=${width},${height}`);
          }
        } else if (launched.family === "firefox") {
          launchOptions.preferences["signon.rememberSignons"] = false;
          if (launched.isHeadless) {
            launchOptions.args.push(`--width=${width}`, `--height=${height}`);
          }
        }
        return launchOptions;
      });
      return config;
    },
  },
});
