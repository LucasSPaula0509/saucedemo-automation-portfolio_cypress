import { dataTest } from "./DataTest";

export const CheckoutOverviewUi = {
  SUMMARY_CONTAINER: dataTest("checkout-summary-container"),
  ITEM_PRICES: dataTest("inventory-item-price"),
  PAYMENT_INFO_LABEL: dataTest("payment-info-label"),
  PAYMENT_INFO_VALUE: dataTest("payment-info-value"),
  SHIPPING_INFO_LABEL: dataTest("shipping-info-label"),
  SHIPPING_INFO_VALUE: dataTest("shipping-info-value"),
  SUBTOTAL: dataTest("subtotal-label"),
  TAX: dataTest("tax-label"),
  TOTAL: dataTest("total-label"),
  FINISH: dataTest("finish"),
  CANCEL: dataTest("cancel"),
} as const;
