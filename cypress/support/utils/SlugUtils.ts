/**
 * Converte nomes de produtos no sufixo usado pelo saucedemo nos atributos data-test. Ex.:
 * "Sauce Labs Backpack" → "sauce-labs-backpack"; "Test.allTheThings() T-Shirt (Red)" →
 * "test.allthethings()-t-shirt-(red)".
 */
export function toSlug(productName: string): string {
  return productName.trim().toLowerCase().replace(/\s+/g, "-");
}
