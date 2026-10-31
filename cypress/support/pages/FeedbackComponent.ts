import { MessageUi } from "../ui/MessageUi";
import { BasePage } from "./base/BasePage";

/** Mensagens exibidas ao usuário: erros (login e checkout) e confirmação do pedido. */
class FeedbackComponent extends BasePage {
  message(): Cypress.Chainable<string> {
    return this.textOf(MessageUi.ANY_FEEDBACK);
  }
}

export const feedback = new FeedbackComponent();
