import { dataTest } from "./DataTest";

export const CheckoutInfoUi = {
  FIRST_NAME: dataTest("firstName"),
  LAST_NAME: dataTest("lastName"),
  POSTAL_CODE: dataTest("postalCode"),
  CONTINUE: dataTest("continue"),
  CANCEL: dataTest("cancel"),
} as const;
