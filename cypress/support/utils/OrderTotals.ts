import { formatCents, parseCents } from "./Money";

/** Imposto de 8%, como fração inteira (8/100) para manter o cálculo em centavos. */
const TAX_RATE_PERCENT = 8;
const PERCENT = 100;

/**
 * Regra de cálculo do resumo do pedido: subtotal = soma dos itens; imposto = 8% do subtotal,
 * arredondado a 2 casas (HALF_UP); total = subtotal + imposto. Valores em centavos.
 */
export interface OrderTotals {
  readonly itemPrices: readonly number[];
  readonly subtotal: number;
  readonly tax: number;
  readonly total: number;
}

export function orderTotalsFromItemPrices(formattedPrices: readonly string[]): OrderTotals {
  const itemPrices = formattedPrices.map(parseCents);
  const subtotal = itemPrices.reduce((sum, price) => sum + price, 0);
  return { itemPrices, subtotal, tax: taxHalfUp(subtotal), total: subtotal + taxHalfUp(subtotal) };
}

export function describeOrderTotals(totals: OrderTotals): string {
  return [
    `Itens: [${totals.itemPrices.map(formatCents).join(", ")}]`,
    `Subtotal (soma dos itens): ${formatCents(totals.subtotal)}`,
    `Imposto (${TAX_RATE_PERCENT}% de ${formatCents(totals.subtotal)}, HALF_UP): ${formatCents(totals.tax)}`,
    `Total (subtotal + imposto): ${formatCents(totals.total)}`,
    "",
  ].join("\n");
}

/** 8% em centavos, arredondando meio centavo para cima (HALF_UP, valores positivos). */
function taxHalfUp(subtotalCents: number): number {
  return Math.floor((subtotalCents * TAX_RATE_PERCENT + PERCENT / 2) / PERCENT);
}
