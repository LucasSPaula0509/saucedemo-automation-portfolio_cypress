import { ActionButtonsUi } from "../ui/ActionButtonsUi";
import { BasePage } from "./base/BasePage";

/** Aciona botões de navegação pelo rótulo visível (ex.: "Finish", "Cancel", "Back Home"). */
class ActionButtonsComponent extends BasePage {
  press(label: string): void {
    this.click(ActionButtonsUi.byLabel(label));
  }
}

export const actionButtons = new ActionButtonsComponent();
