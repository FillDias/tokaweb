# TOKA — telas de autenticação

Especificação visual e de comportamento. Implementar como componentes Vue
com Tailwind, usando os tokens da paleta.

---

## Regras gerais destas telas

**Página isolada.** `/entrar`, `/cadastrar` e `/conta` não têm cabeçalho,
navegação nem rodapé do site. Só a marca no topo. A pessoa está num fluxo
e qualquer link é chance de abandono.

**Coluna de 360px, centralizada**, com respiro em volta. Cartão branco
sobre fundo cinza-papel, borda de 0.5px, canto de 12px.

**Botão chapado nestas telas.** A sombra sólida deslocada é só para ação
principal isolada, como os blocos REGISTRAR e PROCURAR da home. Em
formulário empilhado ela vira ruído.

**Todos os botões com 44px de altura**, mesmo peso visual. Muda só a cor.

**Rótulo de campo:** 12px, peso 500, cor `#6E6C66`, letter-spacing 0.04em,
caixa alta.

**Campo:** 40px de altura, borda `#CFCDC5`, canto 8px, fonte 14px.
Foco: borda mostarda.

---

## Tela 1 — `/entrar`

Ordem, de cima para baixo:

1. **Marca**: トカ em mostarda 26px, TOKA em 19px peso 500,
   subtítulo "Entre para registrar suas peças" em 13px cinza
2. **Botões sociais**, empilhados com 8px de gap:
   - Google: fundo branco, borda `#DADCE0`, texto escuro
   - LINE: fundo `#06C755`, texto branco
   - Apple: fundo `#17181C`, texto branco — **só renderiza se a
     credencial existir**
3. **Divisor** com o texto "ou com email" centralizado, linhas `#E2E0D9`
4. **Campos** email e senha
5. **"Esqueceu a senha?"** alinhado à direita, 12.5px, cinza, sublinhado
6. **Botão Entrar**: fundo mostarda, texto tinta, 44px
7. **Rodapé do cartão**: linha divisória, "Ainda não tem conta?" com o
   link "Cadastre-se" sublinhado em mostarda de 2px

**Social vem antes do email.** No TOKA o caminho mais rápido é o social,
e ele é o que preserva o impulso de quem chegou pelo Google numa ficha.

---

## Tela 2 — `/cadastrar`

Mesma estrutura da tela de entrar, com duas diferenças:

**Faixa mostarda entre o social e o formulário:**

> Com o social leva um clique — você completa o resto depois.

Fundo `#FBF1D6`, borda `#EBDCA9`, texto `#8A7020` em 12px.
Ela existe porque o formulário manual tem cinco campos. Sem o aviso, a
pessoa rola direto e nem considera o caminho curto.

**Campos, nesta ordem:**
- Email
- Senha — placeholder "mínimo 8 caracteres"
- Confirmar senha — placeholder "repita a senha"
- CEP e telefone **na mesma linha**, CEP com 40% da largura

O CEP tem tamanho fixo, então não precisa de linha inteira. Economiza uma
linha, e em cadastro cada linha conta.

**Abaixo do botão:** texto de 11.5px sobre os termos de uso.

---

## Tela 3 — Faixa de completar perfil

Aparece para quem entrou pelo social e está sem CEP e telefone.

**Faixa no topo da página**, fundo `#FBF1D6`, borda inferior `#EBDCA9`:

> Complete seu perfil com CEP e telefone para poder anunciar peças.

À direita: botão "Completar" em mostarda, 32px, e um X para dispensar.

**Não bloqueia nada.** Se a pessoa dispensar, a escolha é guardada e a
faixa não volta.

---

## Tela 4 — Bloqueio ao publicar anúncio

Quando a pessoa tenta publicar sem CEP e telefone, o aviso muda de tom.

**Cartão branco com borda esquerda vermelhão de 3px**, canto reto:

> **Faltam dados para publicar**
> Compradores precisam saber de onde a peça sai e como falar com você.
> Leva 30 segundos.

Abaixo, os dois campos e o botão **"Salvar e publicar"**.

**Crítico: resolve na mesma tela.** Não redirecionar para `/conta`. Se a
pessoa sair do fluxo no meio de publicar, perde o que escreveu e boa
parte desiste.

A justificativa é concreta, não genérica. Explicar o porquê aumenta muito
a taxa de preenchimento.

---

## Tela 5 — Conflito de email

Quando o email digitado já existe em outro provedor.

**Bloco mostarda com borda esquerda de 3px:**

> **Essa conta entra pelo Google**
> O email rafa@gmail.com foi cadastrado pelo Google. Use o mesmo caminho
> para entrar.

Abaixo, o botão do provedor correto, pronto para clicar.

E um texto de 12px: "Quer usar senha? Vincule depois em Minha conta".

**Nunca casar contas automaticamente pelo email.** E este caso não se
aplica quando não há email — o LINE nem sempre devolve.

---

## Tela 6 — Erro de credencial

Senha ou email incorreto.

Borda do campo de senha vira `#C0392B`. Abaixo, texto de 12.5px na mesma
cor: "Email ou senha incorretos. Tente de novo."

**Não dizer qual dos dois está errado.** Informar que o email existe é
dar pista para quem está tentando adivinhar.

---

## Tela 7 — `/conta`

Título "Minha conta", subtítulo "Seus dados e formas de entrar".

**Dados**, em duas linhas:
- Nome e email lado a lado. O **email fica desabilitado** com fundo
  `#F5F4F0` quando vem do provedor social
- CEP e telefone lado a lado. Quando vazios, **borda mostarda** em vez de
  cinza — sinaliza "falta isso" sem precisar de texto de erro

**Formas de entrar**, seção separada por linha divisória. Uma linha por
provedor:
- Ícone do provedor, nome, e à direita:
  - Selo verde "conectado" se já vinculado
  - Botão "Vincular" se disponível
  - Botão "Criar senha" para o provedor email

Permite vincular mais de um provedor à mesma conta.

**Botão "Salvar alterações"** em mostarda no fim.

---

## Comportamento

### Voltar para onde estava

Antes de mandar para `/entrar`, guardar a URL de origem e restaurar
depois do login.

É crítico no fluxo do TOKA: a pessoa chega numa ficha pelo Google, clica
em "Instalei essa peça", loga, e precisa voltar **naquela ficha** — não
na home.

### Apple

Código pronto e testável, mas o botão só renderiza se a credencial
existir. Botão que não funciona é pior que botão ausente.

### Confirmação por email

Esqueleto pronto, desligado por variável de ambiente. Mesmo padrão do
Apple. Quando ativar, será via Resend.

---

## Cores usadas

```
mostarda        #E8B93B   botão primário, destaque, borda de campo faltando
mostarda lavada #FBF1D6   faixa de aviso
mostarda escura #8A7020   texto sobre mostarda lavada
tinta           #17181C   texto principal, botão Apple
cinza texto     #6E6C66   rótulo, texto secundário
borda campo     #CFCDC5
borda divisória #E2E0D9
fundo desabilitado #F5F4F0
celadon         #4E7F6A   selo "conectado"
celadon fundo   #E4F0EA
vermelhão       #C0392B   erro, bloqueio
Google          #4285F4
LINE            #06C755
```
