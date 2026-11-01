/**
 * Links de rastreabilidade (troque pelos endereços do seu gerenciador de issues/casos de teste).
 * Os IDs de KnownDefects.ts usam o padrão de issue.
 */
const ISSUE_URL_TEMPLATE =
  "https://github.com/LucasSPaula0509/saucedemo-automation-portfolio_java/issues?q=%s";
const TMS_URL_TEMPLATE = "https://tms.example.com/browse/%s";

export const ALLURE_LINKS = {
  issue: { urlTemplate: ISSUE_URL_TEMPLATE, nameTemplate: "%s" },
  tms: { urlTemplate: TMS_URL_TEMPLATE, nameTemplate: "%s" },
};

export function issueUrl(id: string): string {
  return ISSUE_URL_TEMPLATE.replace("%s", id);
}
