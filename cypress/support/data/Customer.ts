/** Dados pessoais informados no formulário "Checkout: Your Information". */
export interface Customer {
  readonly firstName: string;
  readonly lastName: string;
  readonly postalCode: string;
}

export const DEFAULT_CUSTOMER: Customer = {
  firstName: "Ana",
  lastName: "Teste",
  postalCode: "06500000",
};
