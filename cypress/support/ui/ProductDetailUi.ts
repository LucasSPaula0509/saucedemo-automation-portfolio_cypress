import { dataTest } from "./DataTest";

export const ProductDetailUi = {
  CONTAINER: "#inventory_item_container",
  NAME: dataTest("inventory-item-name"),
  PRICE: dataTest("inventory-item-price"),
  ADD_TO_CART: dataTest("add-to-cart"),
  REMOVE: dataTest("remove"),
  BACK_TO_PRODUCTS: dataTest("back-to-products"),
} as const;
