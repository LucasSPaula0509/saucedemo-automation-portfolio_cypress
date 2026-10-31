import { dataTest } from "./DataTest";

export const LoginUi = {
  USERNAME: dataTest("username"),
  PASSWORD: dataTest("password"),
  LOGIN_BUTTON: dataTest("login-button"),
} as const;
