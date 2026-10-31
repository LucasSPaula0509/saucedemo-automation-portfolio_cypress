import type { LogLevel, LogMessage } from "../../tasks/log";

/** Envia a mensagem para o console do Node (task "log"), sem poluir o log de comandos. */
export function logToNode(logger: string, message: string, level: LogLevel = "INFO"): void {
  const payload: LogMessage = { level, logger, message };
  cy.task("log", payload, { log: false });
}
