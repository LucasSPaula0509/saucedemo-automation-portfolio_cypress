import { renameSync } from "node:fs";
import path from "node:path";

/**
 * Renomeia o screenshot automático da falha para "Falha - <cenário>.png", o mesmo nome de anexo
 * do projeto Java (o Cypress grava "<funcionalidade> -- <cenário> (failed).png").
 */
export function renameFailureScreenshot(
  details: Cypress.ScreenshotDetails,
): Cypress.ScreenshotDetails {
  if (!details.testFailure) {
    return details;
  }
  const fileName = path.basename(details.path, ".png").replace(/ \(failed\)( \(\d+\))?$/, "");
  const scenario = fileName.split(" -- ").at(-1) ?? fileName;
  const target = path.join(path.dirname(details.path), `Falha - ${scenario}.png`);
  renameSync(details.path, target);
  return { ...details, path: target };
}
