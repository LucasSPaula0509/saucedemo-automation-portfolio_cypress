import { dataTest, dataTestEndingWith } from "./DataTest";

const ALL_ITEMS = dataTest("inventory-sidebar-link");
const ABOUT = dataTest("about-sidebar-link");
const LOGOUT = dataTest("logout-sidebar-link");
const RESET_APP_STATE = dataTest("reset-sidebar-link");

const OPTIONS_BY_LABEL: Readonly<Record<string, string>> = {
  "All Items": ALL_ITEMS,
  About: ABOUT,
  Logout: LOGOUT,
  "Reset App State": RESET_APP_STATE,
};

export const MenuUi = {
  OPTIONS: dataTestEndingWith("-sidebar-link"),
  ALL_ITEMS,
  ABOUT,
  LOGOUT,
  RESET_APP_STATE,

  option(label: string): string {
    const selector = OPTIONS_BY_LABEL[label];
    if (selector === undefined) {
      throw new Error(
        `Opção de menu sem locator mapeado: '${label}'. Mapeadas: ${Object.keys(OPTIONS_BY_LABEL).join(", ")}`,
      );
    }
    return selector;
  },
} as const;
