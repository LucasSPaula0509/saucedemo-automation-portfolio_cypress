import { dataTest } from "./DataTest";

export const HeaderUi = {
  MENU_BUTTON: "#react-burger-menu-btn",
  CART_LINK: dataTest("shopping-cart-link"),
  CART_BADGE: dataTest("shopping-cart-badge"),
  PAGE_TITLE: dataTest("title"),
} as const;
