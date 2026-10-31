/** Atributos de proteção de um cookie, como o navegador os enxerga. sameSite null = ausente. */
export interface CookieAttributes {
  readonly name: string;
  readonly secure: boolean;
  readonly httpOnly: boolean;
  readonly sameSite: string | null;
}

export function cookieAttributesToJson(cookie: CookieAttributes): string {
  return JSON.stringify(
    {
      nome: cookie.name,
      secure: cookie.secure,
      httpOnly: cookie.httpOnly,
      sameSite: cookie.sameSite,
    },
    null,
    2,
  );
}
