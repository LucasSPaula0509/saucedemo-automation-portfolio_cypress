import type { NavigationMetrics } from "./performance/NavigationMetrics";

/**
 * Estado compartilhado entre os steps de um mesmo cenário (o "this" dos steps, equivalente aos
 * contextos ScenarioContext, PerformanceContext e SecurityContext do projeto Java). O hook Before
 * limpa o estado no início de cada cenário.
 */
export interface World extends Mocha.Context {
  username?: string | undefined;
  /** Medições feitas no passo "Quando" e validadas nos passos "Então". */
  navigation?: NavigationMetrics | undefined;
  loginToInventoryMs?: number | undefined;
  /** Cabeçalhos capturados no passo "Quando" e avaliados no passo "Então". */
  responseHeaders?: Readonly<Record<string, string>> | undefined;
}

export function resetWorld(world: World): void {
  world.username = undefined;
  world.navigation = undefined;
  world.loginToInventoryMs = undefined;
  world.responseHeaders = undefined;
}

export function currentUsername(world: World): string {
  if (world.username === undefined) {
    throw new Error("Nenhum usuário definido no cenário (passo 'Dado' ausente?)");
  }
  return world.username;
}

export function measuredNavigation(world: World): NavigationMetrics {
  if (world.navigation === undefined) {
    throw new Error("Nenhuma métrica de navegação coletada no cenário");
  }
  return world.navigation;
}

export function measuredLoginToInventoryMs(world: World): number {
  if (world.loginToInventoryMs === undefined) {
    throw new Error("O tempo do login até a página de produtos não foi medido");
  }
  return world.loginToInventoryMs;
}

export function capturedResponseHeaders(world: World): Readonly<Record<string, string>> {
  if (world.responseHeaders === undefined) {
    throw new Error("Nenhum cabeçalho de resposta capturado no cenário");
  }
  return world.responseHeaders;
}
