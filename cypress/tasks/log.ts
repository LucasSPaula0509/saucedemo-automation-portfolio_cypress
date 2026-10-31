export type LogLevel = "INFO" | "WARN";

export interface LogMessage {
  readonly level: LogLevel;
  readonly logger: string;
  readonly message: string;
}

/** Log no console do Node (terminal e CI), no formato do Logback do projeto Java. */
export function log({ level, logger, message }: LogMessage): null {
  const time = new Date().toISOString().slice(11, 23);
  const line = `${time} ${level.padEnd(5)} ${logger} - ${message}`;
  if (level === "WARN") {
    console.warn(line);
  } else {
    console.log(line);
  }
  return null;
}
