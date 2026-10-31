import { toSlug } from "../utils/SlugUtils";
import { dataTest } from "./DataTest";

export const CartUi = {
  CART_LIST: dataTest("cart-list"),
  ITEM_QUANTITIES: dataTest("item-quantity"),
  ITEM_NAMES: dataTest("inventory-item-name"),
  ITEM_PRICES: dataTest("inventory-item-price"),
  CONTINUE_SHOPPING: dataTest("continue-shopping"),
  CHECKOUT: dataTest("checkout"),

  removeButton(productName: string): string {
    return dataTest(`remove-${toSlug(productName)}`);
  },
} as const;
