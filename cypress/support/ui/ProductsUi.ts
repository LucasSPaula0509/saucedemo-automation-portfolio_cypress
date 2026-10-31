import { toSlug } from "../utils/SlugUtils";
import { dataTest, type TextLocator, withExactText } from "./DataTest";

export const ProductsUi = {
  INVENTORY_LIST: dataTest("inventory-list"),
  ITEM_NAMES: dataTest("inventory-item-name"),
  ITEM_PRICES: dataTest("inventory-item-price"),
  SORT_SELECT: dataTest("product-sort-container"),
  ACTIVE_SORT: dataTest("active-option"),

  addToCartButton(productName: string): string {
    return dataTest(`add-to-cart-${toSlug(productName)}`);
  },

  removeButton(productName: string): string {
    return dataTest(`remove-${toSlug(productName)}`);
  },

  /** Botão do produto, esteja ele no estado "Add to cart" ou "Remove". */
  productButton(productName: string): string {
    return `button[data-test$='-${toSlug(productName)}']`;
  },

  productTitle(productName: string): TextLocator {
    return withExactText(dataTest("inventory-item-name"), productName);
  },
} as const;
