/**
 * Estado compartilhado entre os steps de um mesmo cenário (o "this" dos steps, equivalente ao
 * ScenarioContext do projeto Java). O hook Before limpa o estado no início de cada cenário.
 */
export interface World extends Mocha.Context {
  username?: string | undefined;
}

export function resetWorld(world: World): void {
  world.username = undefined;
}

export function currentUsername(world: World): string {
  if (world.username === undefined) {
    throw new Error("Nenhum usuário definido no cenário (passo 'Dado' ausente?)");
  }
  return world.username;
}
