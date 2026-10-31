import type { StepResult, TestResult } from "allure-cypress";
import type { allureCypress } from "allure-cypress/reporter";
import { KNOWN_DEFECTS } from "../cypress/support/data/KnownDefects";
import { issueUrl } from "./links";

type LifecycleListener = NonNullable<
  NonNullable<Parameters<typeof allureCypress>[2]>["listeners"]
>[number];

const TAG_LABEL = "tag";
const FEATURE_LABEL = "feature";
const DEFECT_TAG = "defeito";
/** Passo do Gherkin como o preprocessor o registra no log do Cypress: "Dado **texto**". */
const GHERKIN_STEP_NAME = /^(\S+) \*\*(.*)\*\*$/s;
const FAILED_STATUSES: readonly string[] = ["failed", "broken"];
const FEATURES: Readonly<Record<string, string>> = {
  login: "Login",
  produtos: "Produtos",
  carrinho: "Carrinho",
  checkout: "Checkout",
  performance: "Performance",
  seguranca: "Segurança",
};

/**
 * Ajusta cada resultado logo antes de o Allure gravá-lo (equivalente ao TestLifecycleListener do
 * projeto Java).
 *
 * - Label Feature a partir da tag da funcionalidade (@login, @produtos...).
 * - Passos do Gherkin com o texto original ("Dado que ..."), sem a marcação do log do Cypress.
 * - Parâmetro "Navegador" e historyId por navegador, para que a mesma execução em Chrome e Firefox
 *   não apareça como retentativa no relatório consolidado do CI.
 * - Cenários @defeito recebem o link de issue mapeado em KnownDefects.ts; quando falham, a
 *   mensagem ganha o prefixo [Defeito conhecido DEF-xxx], usado pela categoria "Defeitos
 *   conhecidos" do categories.json.
 */
export function allureResultEnricher(browserName: () => string): LifecycleListener {
  return {
    beforeTestResultWrite(result: TestResult) {
      const tags = result.labels
        .filter((label) => label.name === TAG_LABEL)
        .map((label) => label.value);
      const feature = tags.map((tag) => FEATURES[tag]).find((name) => name !== undefined);
      if (feature !== undefined) {
        replaceFeature(result, feature);
      }
      result.steps.forEach(renameGherkinStep);
      separateByBrowser(result, browserName());
      if (tags.includes(DEFECT_TAG)) {
        markKnownDefect(result, tags.map((tag) => KNOWN_DEFECTS[tag]).find(Boolean));
      }
    },
  };
}

function replaceFeature(result: TestResult, feature: string): void {
  result.labels = result.labels.filter((label) => label.name !== FEATURE_LABEL);
  result.labels.push({ name: FEATURE_LABEL, value: feature });
}

function renameGherkinStep(step: StepResult): void {
  step.name = step.name?.replace(GHERKIN_STEP_NAME, "$1 $2");
  step.steps.forEach(renameGherkinStep);
}

function separateByBrowser(result: TestResult, browserName: string): void {
  result.parameters.push({ name: "Navegador", value: browserName });
  result.historyId = `${result.historyId ?? ""}:${browserName}`;
}

function markKnownDefect(result: TestResult, defectId: string | undefined): void {
  if (defectId !== undefined) {
    result.links.push({ type: "issue", name: defectId, url: issueUrl(defectId) });
  }
  if (!FAILED_STATUSES.includes(String(result.status))) {
    return;
  }
  // O Allure 2 lê statusDetails.known, que não está nos tipos do allure-js.
  Object.assign(result.statusDetails, { known: true });
  result.statusDetails.message = `[Defeito conhecido ${defectId ?? "sem ID"}] ${result.statusDetails.message ?? ""}`;
}
