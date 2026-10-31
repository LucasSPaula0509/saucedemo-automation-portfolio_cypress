/**
 * Conversão entre textos monetários da tela ("Tax: $0.80", "$29.99") e centavos inteiros. Os
 * cálculos são feitos em centavos para evitar erros de ponto flutuante.
 */
const AMOUNT = /\$(\d+)(?:\.(\d+))?/;
const CENTS_PER_UNIT = 100;

export function parseCents(text: string): number {
  const match = AMOUNT.exec(text);
  if (match === null) {
    throw new Error(`Valor monetário não encontrado em: '${text}'`);
  }
  const [, units = "", decimals = ""] = match;
  if (decimals.length > 2) {
    throw new Error(`Valor monetário com mais de 2 casas decimais: '${text}'`);
  }
  return Number(units) * CENTS_PER_UNIT + Number(decimals.padEnd(2, "0"));
}

export function formatCents(cents: number): string {
  const units = Math.floor(cents / CENTS_PER_UNIT);
  const remainder = String(cents % CENTS_PER_UNIT).padStart(2, "0");
  return `$${units}.${remainder}`;
}
