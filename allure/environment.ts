import { mkdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Grava o environment.properties do Allure (mesmos campos do projeto Java, com "Node" no lugar de
 * "Java").
 */
export function writeAllureEnvironment(
  resultsDir: string,
  config: Cypress.PluginConfigOptions,
  browser: Cypress.Browser | undefined,
): void {
  const env: Record<string, string> = {
    Browser: browser?.name ?? "desconhecido",
    "Browser.Version": browser?.version ?? "",
    "Base.URL": config.baseUrl ?? "",
    Headless: String(browser?.isHeadless ?? false),
    OS: `${os.type()} ${os.release()}`,
    Node: process.version,
  };
  const content = Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  mkdirSync(resultsDir, { recursive: true });
  writeFileSync(path.join(resultsDir, "environment.properties"), `${content}\n`, "utf8");
}
