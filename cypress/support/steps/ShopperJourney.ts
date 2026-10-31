import { DEFAULT_CUSTOMER } from "../data/Customer";
import { cartPage } from "../pages/CartPage";
import { checkoutInfoPage } from "../pages/CheckoutInfoPage";
import { header } from "../pages/HeaderComponent";
import { loginPage } from "../pages/LoginPage";
import { productsPage } from "../pages/ProductsPage";
import type { World } from "../world";
import { expectAbsent, expectLoaded, expectText } from "./Assertions";

/**
 * Pré-condições reutilizáveis montadas pela UI, sempre a partir de uma sessão limpa (carrinho
 * vazio). Cada etapa confirma que chegou onde deveria, para que uma falha de pré-condição não seja
 * confundida com falha do comportamento sob teste.
 */
export function loggedInOnProducts(world: World, username: string): void {
  world.username = username;
  loginPage.loginAs(username);
  expectLoaded(productsPage, `Pré-condição: página de produtos após login de '${username}'`);
}

export function loggedInWithEmptyCart(world: World, username: string): void {
  loggedInOnProducts(world, username);
  expectAbsent(header.cartBadge());
}

export function withCart(world: World, username: string, products: readonly string[]): void {
  loggedInWithEmptyCart(world, username);
  productsPage.addAllToCart(products);
  expectText(
    header.cartBadgeText(),
    `Pré-condição: contador do carrinho com [${products.join(", ")}]`,
    String(products.length),
  );
}

export function atCart(world: World, username: string, products: readonly string[]): void {
  withCart(world, username, products);
  openCart();
}

export function openCart(): void {
  header.openCart();
  expectLoaded(cartPage, "Pré-condição: carrinho aberto");
}

export function atCheckoutInformation(
  world: World,
  username: string,
  products: readonly string[],
): void {
  atCart(world, username, products);
  cartPage.checkout();
  expectLoaded(checkoutInfoPage, "Pré-condição: formulário do checkout");
}

export function withCheckoutInformationFilled(
  world: World,
  username: string,
  products: readonly string[],
): void {
  atCheckoutInformation(world, username, products);
  checkoutInfoPage.fill(DEFAULT_CUSTOMER);
}

export function atCheckoutOverview(
  world: World,
  username: string,
  products: readonly string[],
): void {
  withCheckoutInformationFilled(world, username, products);
  checkoutInfoPage.proceed();
}
