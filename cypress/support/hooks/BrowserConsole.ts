/**
 * Registra o console do navegador da aplicação (chamadas console.* e erros não tratados) para
 * anexar ao Allure quando o cenário falha.
 */
const LEVELS = ["debug", "log", "info", "warn", "error"] as const;
const entries: string[] = [];

function record(level: string, message: string): void {
  entries.push(`${new Date().toISOString()} ${level.toUpperCase()} ${message}`);
}

beforeEach(function () {
  entries.length = 0;
});

Cypress.on("window:before:load", (win) => {
  for (const level of LEVELS) {
    const original = win.console[level].bind(win.console);
    win.console[level] = (...args: unknown[]) => {
      record(level, args.map(String).join(" "));
      original(...args);
    };
  }
  win.addEventListener("error", (event) => {
    record("severe", event.message);
  });
});

export function browserConsoleLogs(): string {
  return entries.length === 0 ? "(console vazio)" : entries.join("\n");
}
