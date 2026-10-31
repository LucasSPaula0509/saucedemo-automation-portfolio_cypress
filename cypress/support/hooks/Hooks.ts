import { Before } from "@badeball/cypress-cucumber-preprocessor";
import { resetWorld, type World } from "../world";
import { logToNode } from "./Logger";

const LOGGER = "Hooks";

/** Ciclo de vida do cenário: estado limpo no início e registro do resultado no fim. */
Before({ order: 0 }, function (this: World, { pickle }) {
  resetWorld(this);
  logToNode(LOGGER, `Iniciando cenário: ${pickle.name}`);
});

// afterEach do Mocha roda também quando o cenário falha (o After do Cucumber não roda).
afterEach(function () {
  const test = this.currentTest;
  logToNode(
    LOGGER,
    `Cenário finalizado [${(test?.state ?? "unknown").toUpperCase()}]: ${test?.title ?? ""}`,
  );
});
