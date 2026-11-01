# Swag Labs — Automação de testes front-end com Cypress

[![Testes E2E](https://github.com/LucasSPaula0509/saucedemo-automation-portfolio_cypress/actions/workflows/tests.yml/badge.svg)](https://github.com/LucasSPaula0509/saucedemo-automation-portfolio_cypress/actions/workflows/tests.yml)
[![Lint](https://github.com/LucasSPaula0509/saucedemo-automation-portfolio_cypress/actions/workflows/lint.yml/badge.svg)](https://github.com/LucasSPaula0509/saucedemo-automation-portfolio_cypress/actions/workflows/lint.yml)
[![Performance e Segurança](https://github.com/LucasSPaula0509/saucedemo-automation-portfolio_cypress/actions/workflows/security-performance.yml/badge.svg)](https://github.com/LucasSPaula0509/saucedemo-automation-portfolio_cypress/actions/workflows/security-performance.yml)
[![Allure Report](https://img.shields.io/badge/Allure-Report-orange)](https://lucasspaula0509.github.io/saucedemo-automation-portfolio_cypress/)

**Allure Report da última execução da `main`:** <https://lucasspaula0509.github.io/saucedemo-automation-portfolio_cypress/>

---

## 1. O que é este projeto

Framework de testes automatizados para o front-end da loja de demonstração **Swag Labs**, em <https://www.saucedemo.com>.

Esta é a **versão Cypress** do projeto [saucedemo-automation-portfolio_java](https://github.com/LucasSPaula0509/saucedemo-automation-portfolio_java) (Java + Selenium). Os dois projetos coexistem: mesmos cenários, mesmas regras, mesmos relatórios e o mesmo CI/CD. Muda só a tecnologia.

Os cenários são escritos em português, no formato BDD (Gherkin), e ficam nos arquivos `.feature`, que são **idênticos** aos do projeto Java. Cada passo é executado em um navegador real pelo Cypress. O resultado é publicado em um relatório Allure.

| Funcionalidade    | Arquivo                                                   | Cenários         |
| ----------------- | --------------------------------------------------------- | ---------------- |
| Login             | `cypress/e2e/features/login.feature`                      | 9 (CT001–CT009)  |
| Produtos          | `cypress/e2e/features/produtos.feature`                   | 10 (CT001–CT010) |
| Carrinho          | `cypress/e2e/features/carrinho.feature`                   | 13 (CT001–CT013) |
| Checkout          | `cypress/e2e/features/checkout.feature`                   | 11 (CT001–CT011) |
| Performance       | `cypress/e2e/features/nao_funcionais/performance.feature` | 3                |
| Segurança passiva | `cypress/e2e/features/nao_funcionais/seguranca.feature`   | 4                |

Os cenários usam esta stack:

| Componente          | Ferramenta                                                                             |
| ------------------- | -------------------------------------------------------------------------------------- |
| Linguagem           | TypeScript (modo estrito) sobre Node.js 26 LTS                                         |
| Pacotes             | npm (`package-lock.json`)                                                              |
| Navegador           | Cypress 16                                                                             |
| BDD                 | `@badeball/cypress-cucumber-preprocessor` com `@bahmutov/cypress-esbuild-preprocessor` |
| Asserções           | Chai/Cypress (`should`, `expect`)                                                      |
| Relatório           | Allure 2 (`allure-cypress` + `allure-commandline`)                                     |
| Logs                | `cy.task("log")` no console do Node                                                    |
| Qualidade de código | ESLint (`typescript-eslint` + `eslint-plugin-cypress`) e Prettier                      |
| CI                  | GitHub Actions; Jenkinsfile opcional                                                   |
| Performance         | Navigation Timing e LCP; Lighthouse CI                                                 |
| Segurança           | Verificações passivas e OWASP ZAP Baseline                                             |

---

## 2. Pré-requisitos

| Ferramenta                         | Para quê                               | Como instalar                                                                                         |
| ---------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Node.js 26 LTS**                 | rodar o Cypress e os scripts           | <https://nodejs.org/>, `winget install OpenJS.NodeJS.LTS` (Windows) ou `nvm install` (usa o `.nvmrc`) |
| **Google Chrome** e/ou **Firefox** | executar os cenários                   | instale normalmente; o Cypress encontra os navegadores instalados                                     |
| **Java 8+** (JRE ou JDK)           | _apenas_ para gerar o relatório Allure | [Temurin](https://adoptium.net/)                                                                      |
| **Git**                            | clonar o repositório                   | <https://git-scm.com/>                                                                                |

```bash
git clone https://github.com/LucasSPaula0509/saucedemo-automation-portfolio_cypress.git
cd saucedemo-automation-portfolio_cypress
node -v           # deve mostrar v26.x
npm ci            # instala as dependências e o binário do Cypress
npx cypress verify
```

> O `npm ci` só roda os scripts de instalação do **Cypress** e do **esbuild**, que estão liberados em `allowScripts` no `package.json` (exigência do npm 11).

---

## 3. Como rodar

```bash
npm test                                        # tudo, exceto @defeito e @performance (Chrome)
npm run test:smoke                              # só o smoke
npx cypress run --browser chrome --expose tags="@login and @negativo"   # combinação de tags
npx cypress run --browser firefox               # outro navegador
npm run test:defeitos                           # defeitos conhecidos (devem falhar)
npm run test:nao-funcionais                     # @performance or @seguranca
npm run cy:open                                 # modo interativo (com janela)
npm run lint                                    # tipos, ESLint e Prettier
npm run allure:serve                            # abre o Allure no navegador
```

- Os scripts `npm test` e `npm run test:*` apagam os resultados anteriores antes de rodar, como o `mvn clean test` do projeto Java.
- `cypress run` roda sem janela (headless). Para ver o navegador, use `npm run cy:open` ou acrescente `--headed`.
- Sem `--browser`, o `npx cypress run` usa o Electron, que vem com o Cypress. Os scripts `npm` sempre usam o Chrome, o navegador padrão do projeto Java.
- No Cypress 16, as **tags vão em `--expose`**, não em `--env` (veja [Decisões técnicas](#11-decisões-técnicas)).

### Abrindo o relatório Allure

- `npm run allure:serve` gera o relatório a partir de `allure-results/` e abre no navegador.
- `npm run allure:generate` gera o HTML em `allure-report/`; `npm run allure:open` abre esse relatório por um servidor local.
- Também há relatórios do Cucumber em `reports/cucumber.html` e `reports/cucumber.json`.
- O Allure CLI roda na JVM: é preciso ter Java instalado (seção 2).

### Configurações

Ficam em [`cypress.config.ts`](cypress.config.ts) e podem ser sobrescritas na linha de comando:

| Configuração                             | Padrão                              | Como sobrescrever                                         | Descrição                                                        |
| ---------------------------------------- | ----------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| `baseUrl`                                | `https://www.saucedemo.com`         | `CYPRESS_BASE_URL=...` ou `--config baseUrl=...`          | URL do site                                                      |
| navegador                                | `chrome` (scripts npm)              | `--browser chrome\|firefox\|edge`                         | navegador da execução                                            |
| headless                                 | `cypress run` = sem janela          | `--headed` ou `npm run cy:open`                           | com ou sem janela                                                |
| `defaultCommandTimeout`                  | `10000` (ms)                        | `--config defaultCommandTimeout=20000`                    | tempo máximo de cada espera                                      |
| `viewportWidth` / `viewportHeight`       | `1920` / `1080`                     | `--config viewportWidth=...`                              | tamanho da tela                                                  |
| `tags` (`expose`)                        | `not @defeito and not @performance` | `--expose tags="..."`                                     | filtro de cenários                                               |
| `screenshotEveryStep` (`expose`)         | `false`                             | `--expose screenshotEveryStep=true`                       | `true` anexa screenshot de todos os passos (padrão: só da falha) |
| `perf.login.page.max.ms` (`env`)         | `3000`                              | `--env perf.login.page.max.ms=4000` ou `cypress.env.json` | limite de carregamento da página de login                        |
| `perf.login.to.inventory.max.ms` (`env`) | `2000`                              | idem                                                      | limite do login até a página de produtos                         |
| `perf.lcp.max.ms` (`env`)                | `2500`                              | idem                                                      | limite do Largest Contentful Paint                               |
| `securityFailOnFindings` (`env`)         | `false`                             | `--env securityFailOnFindings=true`                       | `true` faz achados de segurança reprovarem o cenário             |

Para mudar valores de `env` sem linha de comando, copie [`cypress.env.example.json`](cypress.env.example.json) para `cypress.env.json` (fora do Git) e edite. Variáveis de ambiente `CYPRESS_<chave>` também funcionam para o `env`.

**Execução sequencial:** um cenário por vez, localmente e no CI. Não há paralelismo.

---

## 4. Estrutura do projeto

```text
├── .github/workflows/
│   ├── tests.yml                  # smoke → regressão (chrome, depois firefox) → defeitos → Allure no Pages
│   ├── lint.yml                   # actionlint + tipos, ESLint e Prettier
│   └── security-performance.yml   # @performance, Lighthouse, @seguranca, ZAP (agendado/manual)
├── Jenkinsfile                    # pipeline opcional equivalente
├── allure/
│   ├── categories.json            # categorias do Allure (copiado para allure-results)
│   ├── AllureResultEnricher.ts    # ajusta cada resultado antes de gravar (Feature, defeito, navegador)
│   ├── environment.ts             # grava o environment.properties
│   └── links.ts                   # padrões de link de issue e TMS
├── cypress/
│   ├── e2e/features/              # login, produtos, carrinho, checkout (+ nao_funcionais/)
│   ├── support/
│   │   ├── ui/            # LOCATORS: só seletores CSS (strings) e funções que montam seletores
│   │   ├── pages/         # PAGE OBJECTS: ações e leitura de estado, sem asserções
│   │   │   └── base/BasePage.ts     # helpers de ação e leitura (esperas nativas do Cypress)
│   │   ├── steps/         # STEP DEFINITIONS em português: orquestram páginas e fazem as asserções
│   │   ├── hooks/         # preparação do cenário, evidências, console do navegador
│   │   ├── data/          # constantes: usuários, senhas, produtos, caminhos, títulos, defeitos
│   │   ├── utils/         # slug de produto, dinheiro em centavos, cálculo do pedido, log
│   │   ├── performance/   # coletor de métricas de navegação e limites
│   │   ├── security/      # leitura de cookies e cabeçalhos (somente leitura)
│   │   ├── world.ts       # estado do cenário (o "this" dos steps)
│   │   └── e2e.ts         # suporte carregado antes de cada feature
│   └── tasks/             # tasks do Node: log e renomeação do screenshot de falha
├── lighthouserc.json              # configuração do Lighthouse CI
├── zap/rules.tsv                  # severidade das regras do ZAP Baseline
├── cypress.config.ts              # configuração do Cypress, Cucumber e Allure
├── cypress.env.example.json       # modelo do cypress.env.json (fora do Git)
├── .cypress-cucumber-preprocessorrc.json   # onde ficam os steps, filtro de tags, relatórios
├── tsconfig.json / eslint.config.mjs / .prettierrc
├── .nvmrc
└── package.json
```

### Fluxo de um passo: feature → step → page → ui

Exemplo do cenário `@CT001_Login`:

```gherkin
# cypress/e2e/features/login.feature
Quando ele se autentica com a senha "secret_sauce"
```

```ts
// steps/LoginSteps.ts: liga o texto do Gherkin ao código ("this" é o estado do cenário)
When("ele se autentica com a senha {string}", function (this: World, password: string) {
  loginPage.login(currentUsername(this), password);
});
```

```ts
// pages/LoginPage.ts: ações da página (o Cypress espera o elemento dentro de type/click)
login(username: string, password: string): void {
  this.type(LoginUi.USERNAME, username);
  this.type(LoginUi.PASSWORD, password);
  this.click(LoginUi.LOGIN_BUTTON);
}
```

```ts
// ui/LoginUi.ts: onde o elemento está na tela
export const LoginUi = {
  USERNAME: dataTest("username"), // [data-test='username']
  PASSWORD: dataTest("password"),
  LOGIN_BUTTON: dataTest("login-button"),
} as const;
```

A validação fica no step do `Então`:

```ts
// steps/CommonSteps.ts
Then("a página de produtos é exibida", function () {
  expectLoaded(productsPage, "Página de produtos carregada");
  expectText(header.pageTitle(), "Título da página", PageTitles.PRODUCTS);
});
```

As pages devolvem leituras encadeáveis (`Cypress.Chainable`). Os helpers de `steps/Assertions.ts` usam `should`, então o Cypress **repete a leitura** até a asserção passar ou o tempo acabar.

---

## 5. Como criar um novo cenário

Exemplo: verificar que o carrinho mostra a quantidade de um produto.

1. **Escreva o cenário** no `.feature` da funcionalidade. Use o próximo ID livre e as tags adequadas:
   ```gherkin
   @CT014_Carrinho @regressivo @positivo
   Cenário: Quantidade do produto no carrinho
     Dado que o carrinho do usuário "standard_user" contém o produto "Sauce Labs Onesie"
     Quando ele acessa o carrinho
     Então a quantidade do produto "Sauce Labs Onesie" é "1"
   ```
2. **Rode só esse cenário** com `npx cypress run --browser chrome --expose tags=@CT014_Carrinho`. O preprocessor avisa quais passos estão indefinidos e sugere o código do step.
3. **Reaproveite passos existentes** sempre que possível. Busque o texto em `steps/` (`Given`/`When`/`Then`).
4. **Seletor:** se o elemento ainda não estiver mapeado, inspecione a página (F12) e adicione no arquivo `ui/` da tela. Use `[data-test='...']` sempre que existir:
   ```ts
   ITEM_QUANTITIES: dataTest("item-quantity"),
   ```
5. **Page Object:** crie um método de ação ou de leitura em `pages/`, usando os helpers da `BasePage` (`click`, `type`, `textOf`, `textsOf`, `element`...). Não use `cy.get` com seletor escrito na page e não faça asserção aqui.
6. **Step:** implemente o passo em `steps/` com `function` (nunca arrow function, para ter acesso ao `this`), chamando a page e validando com os helpers de `Assertions.ts` ou com `should`/`expect` e uma descrição.
7. **Rode de novo**, depois rode a regressão (`npm test`) e confira o código com `npm run lint`.

---

## 6. Convenções do projeto

- **Seletores só em `ui/`**, como constantes `readonly`. A ordem de preferência é `data-test` → `id` → `name` → CSS. Não há XPath.
- **Nada de** `cy.wait(<número>)`, `setTimeout` ou qualquer espera fixa. A regra `cypress/no-unnecessary-waiting` do ESLint está configurada como **erro**.
- **Esperas só as nativas do Cypress** (retry até `defaultCommandTimeout`). Ausência de elemento é validada com `should("not.exist")`.
- **Pages** têm só ações e leitura de estado, **sem asserções** e sem dados fixos.
- **Steps** só orquestram pages e fazem as **asserções**. Sem `cy.get`, seletores ou esperas. Tabelas e resumos são comparados **inteiros** (`deep.equal`), para mostrar todas as diferenças de uma vez.
- **Estado do cenário no World** (`world.ts`), limpo no início de cada cenário. Nada de estado estático entre cenários.
- **Cenários independentes.** `testIsolation: true` limpa cookies e storage entre cenários; cada um monta as próprias pré-condições pela interface.
- **Não mude um resultado esperado só para o teste passar.** Se o site se comportar diferente, o teste deve falhar e a divergência deve ser reportada (veja [Defeitos conhecidos](#10-defeitos-conhecidos)).
- **Qualidade de código:** `npm run lint` (TypeScript estrito, ESLint sem erros nem avisos e Prettier) e `npm run format` para formatar.

---

## 7. Tags

| Tag                                                                          | Significado                                                         |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `@login`, `@produtos`, `@carrinho`, `@checkout`                              | funcionalidade (vira **Feature** no Allure)                         |
| `@CTnnn_<Funcionalidade>`                                                    | ID de rastreabilidade do cenário (ex.: `@CT001_Login`)              |
| `@regressivo`                                                                | faz parte da regressão funcional                                    |
| `@smoke`                                                                     | caminho crítico, rápido; roda primeiro no CI                        |
| `@positivo` / `@negativo`                                                    | fluxo feliz / validação de erro                                     |
| `@ordenacao`, `@detalhe`, `@menu`, `@calculo`, `@cancelamento`, `@validacao` | agrupamentos por assunto                                            |
| `@seguranca`                                                                 | verificação de segurança (funcional no login ou passiva)            |
| `@passivo`                                                                   | verificação de segurança somente leitura (`seguranca.feature`)      |
| `@performance`                                                               | performance percebida; **fora** do filtro padrão                    |
| `@defeito`                                                                   | defeito conhecido; **fora** do filtro padrão, com job próprio no CI |

O filtro padrão, configurado em `cypress.config.ts` (`expose.tags`), é `not @defeito and not @performance`.

---

## 8. CI/CD

### `tests.yml`: a cada push/PR na `main`, todo dia às 09:00 (BRT) e sob demanda

```text
smoke (chrome) ──► regressão (chrome) ──► regressão (firefox) ──► defeitos conhecidos ──► Allure Report ──► GitHub Pages (só na main)
```

Tudo roda **em sequência**: um job por vez (encadeados com `needs`), um navegador por vez na matriz (`max-parallel: 1`) e um cenário por vez. Não há Cypress Cloud, `--parallel`, `--record` nem divisão de specs.

| Job               | O que faz                                                                                                                                                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **smoke**         | `@smoke and not @defeito` no Chrome headless. Se falhar, a regressão nem começa.                                                                                                                                                                                                    |
| **regression**    | `not @defeito and not @performance` em matriz **Chrome** e depois **Firefox**                                                                                                                                                                                                       |
| **known-defects** | só `@defeito`, com `continue-on-error`. Roda mesmo se a regressão falhar. Deve ficar vermelho enquanto os defeitos existirem; quando ficar verde, o defeito foi corrigido.                                                                                                          |
| **report**        | roda sempre (`if: always()`): junta os `allure-results` de todos os jobs, recupera o histórico (tendência) do relatório anterior, gera o Allure e publica em <https://lucasspaula0509.github.io/saucedemo-automation-portfolio_cypress/>. Em PR, o relatório fica só como artifact. |

- **Execução manual:** em _Actions → Testes E2E → Run workflow_, escolha o `browser` e as `tags`.
- **Artifacts** (sempre enviados, mesmo com falha): `allure-results-*`, `evidencias-*` (relatórios do Cucumber em `reports/` e `cypress/screenshots`) e `allure-report`.
- Os screenshots de falha também ficam dentro do Allure.

### `lint.yml`: a cada push/PR

- `actionlint` valida os workflows.
- `npm run lint` valida tipos, ESLint e Prettier.

### `security-performance.yml`: só agendado (segunda, 10:00 BRT) ou manual

- Performance (`@performance`), Lighthouse CI, segurança passiva (`@seguranca`) e OWASP ZAP Baseline. Detalhes na próxima seção.

### Jenkins (opcional)

O [`Jenkinsfile`](Jenkinsfile) tem os estágios Instalar → Smoke → Regressão → Defeitos conhecidos e publica com o plugin Allure Jenkins. O estágio de defeitos marca o build como _UNSTABLE_, sem quebrá-lo. Para usar, cadastre uma instalação do plugin NodeJS chamada `node-26`, tenha um Java no agente (para o Allure) e configure a ferramenta Allure.

---

## 9. Performance e segurança

O saucedemo é um **site público de terceiros**, e não temos autorização do dono para testes agressivos. Por isso:

- **Não há teste de carga ou stress** (JMeter, k6, Gatling). Muitos usuários virtuais seriam, na prática, um ataque de negação de serviço.
- **Não há scan ativo, fuzzing, força bruta ou injeção.** Só verificações **passivas**: ler o que o navegador já recebe numa navegação normal.

### Performance (`@performance`)

Cada cenário faz **uma única navegação**:

| Cenário                                           | Métrica                                                                       | Limite (configurável) |
| ------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------- |
| Carregamento da página de login                   | `loadEventEnd` (Navigation Timing) e **LCP** (`PerformanceObserver`)          | 3000 ms / 2500 ms     |
| Login do `standard_user` até a página de produtos | tempo do clique até a lista visível                                           | 2000 ms               |
| Login do `performance_glitch_user`                | o mesmo tempo, que **deve ficar acima** do limite (o usuário simula lentidão) | 2000 ms               |

As métricas são lidas de `window.performance` via `cy.window()` e anexadas ao Allure em JSON.

O tempo do login é medido pelo próprio teste e inclui a latência do Cypress, por isso o limite é folgado.

**Lighthouse CI** ([`lighthouserc.json`](lighthouserc.json), o mesmo do projeto Java):

- faz 3 execuções na página de login (perfil desktop) e usa a execução mediana;
- exige performance ≥ 0.8, acessibilidade ≥ 0.9 e boas práticas ≥ 0.9;
- publica o relatório como artifact `lighthouse-report`.

Para rodar o Lighthouse localmente: `npx @lhci/cli autorun`.

**Achado conhecido (o mesmo do projeto Java):** a nota de boas práticas fica abaixo do mínimo de 0.9 (**0.78** na execução de 31/10/2026 deste repositório; 0.81 no projeto Java), porque o site usa _unload event listeners_, descontinuados no Chrome. Por isso o job **Lighthouse CI** fica vermelho. Isso é um achado do site, e o limite não foi reduzido.

### Segurança

| Verificação                                                       | Onde                                                                                                                            | Cobre                                            | **Não** cobre                                             |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------- |
| Senha mascarada, acesso direto sem login, sessão após logout      | `login.feature` (`@seguranca`)                                                                                                  | controles de acesso visíveis ao usuário          | autorização no servidor, APIs                             |
| HTTP redireciona para HTTPS                                       | `seguranca.feature`                                                                                                             | redirecionamento do domínio principal            | versões/cifras de TLS, certificados                       |
| Atributos do cookie de sessão (`Secure`, `HttpOnly`, `SameSite`)  | `seguranca.feature` (`cy.getCookie`)                                                                                            | o cookie `session-username` visto pelo navegador | outros cookies, roubo ou fixação de sessão                |
| `autocomplete` do campo de senha                                  | `seguranca.feature`                                                                                                             | se o atributo existe e tem valor adequado        | política de senha do servidor                             |
| Cabeçalhos CSP, X-Frame-Options, X-Content-Type-Options e HSTS    | `seguranca.feature` (`cy.intercept` observando o próprio carregamento da página; só Chrome/Edge, no Firefox o cenário é pulado) | a resposta do documento principal                | conteúdo da CSP, cabeçalhos de outros recursos            |
| **OWASP ZAP Baseline** (`zap/rules.tsv`, o mesmo do projeto Java) | `security-performance.yml`                                                                                                      | spider de 1 minuto e regras **passivas** do ZAP  | qualquer regra ativa (XSS, SQLi etc.), áreas autenticadas |

- **Achados não reprovam os testes por padrão.** Eles vão para o Allure (anexos "achados" e "evidência") e para o log como `WARN`. Com `--env securityFailOnFindings=true`, cada achado reprova o cenário.
- O ZAP roda com `fail_action: false` e não abre issues. O relatório HTML fica no artifact `zap-report`.
- **Achados atuais:**
  - o cookie de sessão não tem `Secure`, `HttpOnly` nem `SameSite`;
  - o campo de senha não tem `autocomplete`;
  - a página de login não envia CSP, X-Frame-Options, X-Content-Type-Options nem HSTS.

---

## 10. Defeitos conhecidos

Cenários marcados com `@defeito` **continuam falhando enquanto o defeito existir**. O resultado esperado do cenário não é alterado. Eles ficam fora da regressão padrão e rodam no job `known-defects`.

No Allure, aparecem na categoria **"Defeitos conhecidos"**, com o link do ID configurado em [`KnownDefects.ts`](cypress/support/data/KnownDefects.ts).

| ID      | Cenário                                                           | Comportamento esperado                    | Comportamento observado                                                | Observado em |
| ------- | ----------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------- | ------------ |
| DEF-001 | `@CT013_Carrinho` Reset App State restaura os botões dos produtos | botões voltam para "Add to cart"          | o contador some, mas o botão continua "Remove" até recarregar a página | 30/10/2026   |
| DEF-002 | `@CT011_Checkout` Checkout bloqueado com carrinho vazio           | o checkout não é iniciado                 | o site vai para `/checkout-step-one.html` com o carrinho vazio         | 30/10/2026   |
| DEF-003 | `@CT009_Produtos` Opções disponíveis no menu lateral              | All Items, About, Logout, Reset App State | aparece também **"Dynamic Catalog"**                                   | 31/10/2026   |

Quando um defeito for corrigido:

1. o job `known-defects` passa a mostrar o cenário como aprovado;
2. remova a tag `@defeito` do cenário e a linha do `KnownDefects.ts` (e faça o mesmo no projeto Java, para os dois continuarem iguais).

---

## 11. Decisões técnicas

### Mapeamento Java → Cypress

| Projeto Java                                                             | Projeto Cypress                                                          | Observação                                                                         |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Java 21 + Maven Wrapper                                                  | TypeScript estrito + npm + `.nvmrc` (Node 26)                            |                                                                                    |
| Selenium WebDriver 4                                                     | Cypress 16                                                               |                                                                                    |
| Cucumber 7 + JUnit Platform + `TestRunner`                               | `@badeball/cypress-cucumber-preprocessor` + esbuild                      | não há runner: o Cypress executa as features                                       |
| AssertJ + SoftAssertions                                                 | Chai/Cypress; listas e resumos comparados inteiros com `deep.equal`      |                                                                                    |
| PicoContainer + `ScenarioContext`/`PerformanceContext`/`SecurityContext` | World do Cucumber (`world.ts`)                                           |                                                                                    |
| `DriverManager` (ThreadLocal) + execução paralela                        | execução sequencial                                                      | paralelismo fora do escopo                                                         |
| `DriverFactory` (preferências do Chrome/Firefox, modo anônimo)           | `before:browser:launch` + `testIsolation: true`                          | o Cypress não abre janela anônima; o isolamento limpa cookies e storage            |
| `config.properties` + `ConfigReader` + `Environment`                     | `cypress.config.ts` (`env`, `expose`) + `cypress.env.json` + `CYPRESS_*` |                                                                                    |
| `ui/*Ui.java` (`By`)                                                     | `ui/*Ui.ts` (strings CSS)                                                | mesmos seletores                                                                   |
| XPath `normalize-space()` em `ProductsUi.productTitle`                   | seletor CSS + regex de texto exato (`cy.contains`)                       | sem plugin de XPath                                                                |
| `BasePage` com `WebDriverWait`                                           | `BasePage` com as esperas nativas do Cypress                             |                                                                                    |
| `isLoaded()` booleano                                                    | `marker()` + `path`, validados no step com retry (`expectLoaded`)        | as pages não fazem asserção                                                        |
| `Money`/`OrderTotals` (`BigDecimal`, HALF_UP)                            | `utils/Money.ts`/`OrderTotals.ts` em centavos inteiros                   | evita erro de ponto flutuante                                                      |
| `Hooks` (`@Before`, `@AfterStep`, `@After`)                              | `Before` e `AfterStep` do preprocessor + `afterEach` do Mocha            | o `After` do Cucumber não roda quando o cenário falha                              |
| `Evidence` (logs de console via WebDriver, só Chromium)                  | `window:before:load` registra `console.*` e erros não tratados           | funciona em todos os navegadores; não inclui erros de rede que o Chrome registrava |
| `AllureResultEnricher` (SPI `TestLifecycleListener`)                     | `allure/AllureResultEnricher.ts` (`listeners` do `allure-cypress`)       | mesmas regras                                                                      |
| `known-defects.properties`                                               | `cypress/support/data/KnownDefects.ts`                                   | mesmos IDs                                                                         |
| `allure.properties` (padrões de link)                                    | `allure/links.ts`                                                        | mesmas URLs                                                                        |
| `AllureEnvironment`                                                      | `allure/environment.ts`                                                  | "Java" vira "Node"                                                                 |
| `categories.json` (copiado pelo Maven)                                   | `allure/categories.json` (copiado no `after:run`)                        | arquivo idêntico                                                                   |
| SLF4J + Logback                                                          | `cy.task("log")` com o mesmo formato                                     |                                                                                    |
| CDP (`Network.responseReceived`) para cabeçalhos                         | `cy.intercept` observando o carregamento normal                          | sem requisição extra                                                               |
| `System.nanoTime` no login                                               | `performance.now()` entre comandos do Cypress                            |                                                                                    |
| `JavascriptExecutor` (Navigation Timing e LCP)                           | `cy.window()` + `PerformanceObserver`                                    |                                                                                    |
| Spotless (google-java-format)                                            | ESLint + Prettier                                                        |                                                                                    |
| `setup-java` + cache Maven                                               | `setup-node` (`.nvmrc`) + cache npm + `cypress-io/github-action`         |                                                                                    |
| `lighthouserc.json`, `zap/rules.tsv`, `.feature`                         | copiados sem alteração                                                   | conferidos por sha256                                                              |

### Outras decisões

| Decisão                                                                                       | Motivo                                                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node 26 LTS                                                                                   | o Cypress 16 exige Node 22 ou mais novo, e o Node 20 deixou de ter suporte em 30/04/2026                                                                                                                                                                                  |
| TypeScript 6.0 (não 7.0)                                                                      | o `typescript-eslint` ainda não aceita o TypeScript 7                                                                                                                                                                                                                     |
| Bibliotecas além da lista original: `typescript-eslint`, `esbuild` e `@types/node`            | ESLint lendo TypeScript, dependência obrigatória do preprocessor e tipos das tasks do Node; aprovadas pelo responsável pelo projeto                                                                                                                                       |
| ESLint sem `@eslint/js`                                                                       | o ESLint 10 não traz mais essas regras embutidas; para não adicionar outra biblioteca, valem as regras estritas do `typescript-eslint` e do `eslint-plugin-cypress`                                                                                                       |
| Tags em `--expose tags=...` (não `--env`)                                                     | no Cypress 16, valores públicos vão em `expose`, e o preprocessor lê as tags de lá                                                                                                                                                                                        |
| Limites de performance e `securityFailOnFindings` em `env`                                    | mantêm a precedência do Java (linha de comando > variável de ambiente > arquivo) com `--env`, `CYPRESS_*` e `cypress.env.json`; são lidos com `cy.env()`                                                                                                                  |
| `screenshotEveryStep` em `expose`                                                             | é lido de forma síncrona no carregamento do spec: o hook `AfterStep` só é registrado quando a opção está ligada, e o relatório não ganha um passo vazio por step                                                                                                          |
| Cabeçalhos de segurança só em Chrome/Edge                                                     | decisão do responsável pelo projeto: mantém o mesmo escopo e a mesma contagem do Java (no Firefox, o cenário é pulado)                                                                                                                                                    |
| `cy.intercept` em vez de `cy.request` para os cabeçalhos                                      | decisão do responsável pelo projeto: observa a resposta da navegação normal, sem uma requisição a mais                                                                                                                                                                    |
| `allure-cypress` e o preprocessor compartilham `after:spec`, `after:run` e `after:screenshot` | o Cypress aceita um único handler por evento; os dois são chamados no mesmo handler, sem o pacote extra `cypress-on-fix`                                                                                                                                                  |
| Screenshot de falha renomeado para `Falha - <cenário>.png`                                    | mesmo nome de anexo do Java; o Cypress grava `<funcionalidade> -- <cenário> (failed).png`                                                                                                                                                                                 |
| URL, HTML e console anexados no `afterEach`                                                   | aparecem no Allure em _Tear down_ do cenário                                                                                                                                                                                                                              |
| Passos do Gherkin limpos no enricher                                                          | o `allure-cypress` só reconhece as palavras-chave em inglês e gravava `Dado **texto**`                                                                                                                                                                                    |
| `statusDetails.known` via `Object.assign`                                                     | o Allure 2 lê esse campo, mas os tipos do allure-js não o declaram                                                                                                                                                                                                        |
| Link de issue apontando para o repositório Java                                               | mesmas URLs do projeto original; troque em `allure/links.ts` se os defeitos forem registrados neste repositório                                                                                                                                                           |
| `npm test` limpa resultados e usa Chrome                                                      | equivalente ao `mvn clean test` com `browser=chrome`                                                                                                                                                                                                                      |
| `known-defects` com `if: !cancelled()`                                                        | os jobs agora são encadeados; assim os defeitos continuam rodando mesmo se a regressão falhar, como no Java                                                                                                                                                               |
| `setup-java` só no job `report`                                                               | o Allure CLI roda na JVM                                                                                                                                                                                                                                                  |
| LCP sem `setTimeout` de 1 s                                                                   | `setTimeout` é proibido no projeto: sem suporte a LCP no navegador, o valor é `null`; com suporte, o `PerformanceObserver` entrega a entrada já registrada                                                                                                                |
| Mesmas decisões de cenário do Java                                                            | "a mensagem {string} é exibida" lê erro ou confirmação; botões pelo rótulo do Gherkin; rótulos do resumo sem ":"; pré-condições de checkout com "Sauce Labs Backpack"; "que o visitante não está autenticado" não executa nada (o isolamento já garante a sessão anônima) |

---

## 12. Troubleshooting

| Problema                                                                      | Causa / solução                                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Popup "Alterar sua senha" / "senha vazada" do Chrome** atrapalha o clique   | o projeto desliga o gerenciador de senhas e o alerta de vazamento no `before:browser:launch` (`credentials_enable_service`, `password_manager_enabled`, `password_manager_leak_detection`). Se ainda aparecer, atualize o Chrome e confira essas opções em `cypress.config.ts`. |
| **`Cypress.exe: bad option: --smoke-test`**                                   | a variável `ELECTRON_RUN_AS_NODE` está definida no terminal (acontece em alguns terminais integrados a editores). Rode `unset ELECTRON_RUN_AS_NODE` (bash) ou `Remove-Item Env:ELECTRON_RUN_AS_NODE` (PowerShell).                                                              |
| **"The cypress npm package is installed, but the Cypress binary is missing"** | o script de instalação do Cypress não rodou. Confira o `allowScripts` do `package.json` e rode `npx cypress install`.                                                                                                                                                           |
| **Timeout com `performance_glitch_user`**                                     | esse usuário tem lentidão proposital (~5 s no login). O `defaultCommandTimeout` de 10 s já cobre esse caso; em máquina ou rede lenta, use `--config defaultCommandTimeout=20000`.                                                                                               |
| **O filtro de tags não funciona com `--env tags=...`**                        | no Cypress 16, use `--expose tags="..."`.                                                                                                                                                                                                                                       |
| **`npx cypress run` abriu o Electron**                                        | sem `--browser`, o Cypress usa o Electron. Use `--browser chrome` ou os scripts `npm`.                                                                                                                                                                                          |
| **`allure: command not found` ou erro de Java ao gerar o relatório**          | o Allure CLI precisa de Java. Instale um JRE/JDK e confira o `JAVA_HOME`.                                                                                                                                                                                                       |
| **Cenário de cabeçalhos aparece como "skipped" no Firefox**                   | esperado: a verificação de cabeçalhos é restrita a Chrome/Edge, como no projeto Java                                                                                                                                                                                            |
| **O job "Defeitos conhecidos" está vermelho**                                 | esperado enquanto os defeitos existirem; o workflow continua verde (`continue-on-error`)                                                                                                                                                                                        |
| **Resultados de execuções antigas no Allure**                                 | os scripts `npm` limpam `allure-results/` antes de rodar; com `npx cypress run`, rode `npm run clean` antes                                                                                                                                                                     |
