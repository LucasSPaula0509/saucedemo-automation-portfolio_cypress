/** Fábrica de seletores pelo atributo data-test, o seletor preferencial do projeto. */
export function dataTest(value: string): string {
  return `[data-test='${value}']`;
}

export function dataTestEndingWith(suffix: string): string {
  return `[data-test$='${suffix}']`;
}

/**
 * Elemento localizado por seletor CSS + texto exato (equivale ao XPath com normalize-space() do
 * projeto Java): espaços nas pontas são ignorados e espaços internos podem variar.
 */
export interface TextLocator {
  readonly selector: string;
  readonly text: RegExp;
}

export function withExactText(selector: string, text: string): TextLocator {
  const words = text
    .trim()
    .split(/\s+/)
    .map((word) => Cypress._.escapeRegExp(word));
  return { selector, text: new RegExp(`^\s*${words.join("\s+")}\s*$`) };
}
