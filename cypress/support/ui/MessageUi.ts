import { dataTest } from "./DataTest";

/** Mensagens de retorno ao usuário: erros de validação e confirmação do pedido. */
export const MessageUi = {
  ERROR: dataTest("error"),
  ANY_FEEDBACK: `${dataTest("error")}, ${dataTest("complete-header")}`,
} as const;
