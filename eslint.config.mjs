import pluginCypress from "eslint-plugin-cypress";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores([
    "node_modules/",
    "allure-results/",
    "allure-report/",
    "reports/",
    "cypress/screenshots/",
    "cypress/videos/",
    "cypress/downloads/",
  ]),
  {
    files: ["**/*.ts"],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["cypress/**/*.ts"],
    extends: [pluginCypress.configs.recommended],
    rules: {
      // Proibido cy.wait(<número>): use a espera nativa (retry) do Cypress.
      "cypress/no-unnecessary-waiting": "error",
      "cypress/unsafe-to-chain-command": "error",
    },
  },
);
