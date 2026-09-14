# Conflito de interesse — anúncios próprios (venda própria)

A TOKA vai vender algumas peças próprias nos classificados (etapa 7), no
mesmo catálogo que também ordena e recomenda peças de terceiros. Isso é
um conflito de interesse real: se a busca ou o ranking de peça pudesse
ser influenciado por "essa peça também está à venda pela TOKA", a
confiança no catálogo inteiro desmorona no primeiro sinal de
manipulação suspeitada — e não volta (ver `PROJETO.md` 2.3 e 7.4).
Decidimos quatro regras rígidas, sem exceção, válidas desde a primeira
linha de código do anúncio, não como aspiração para revisar depois:

1. **Selo visível, em cor distinta.** Anúncio próprio (`anuncio.vendaPropria`)
   é sempre identificado como tal, nunca camuflado entre os de terceiros.
2. **Nunca em posição privilegiada.** Na listagem de classificados, um
   anúncio próprio segue exatamente o mesmo critério de ordenação
   (relevância, data) que qualquer outro — sem boost, sem fixação no topo.
3. **A busca e o ranking de peça nunca consideram anúncio.** `buscarPecaPorCodigo`
   e `buscarPecasProximas` (`server/database/queries/peca.ts`) e a
   orquestração em `server/api/buscar.get.ts` não têm — e não podem
   ganhar — nenhum caminho que leia a tabela `anuncio`, direto ou
   indireto (coluna calculada, trigger, view). Essa é a única das
   quatro regras com reforço automatizado: um teste-tripwire estático
   (`server/regra-anti-conflito-anuncio.test.ts`) falha se a palavra
   `anuncio` aparecer nesses dois arquivos, e um teste comportamental
   no mesmo arquivo (hoje `.todo`, até a tabela `anuncio` existir) vai
   provar que a ordem da busca não muda com ou sem anúncio ativo.
4. **Nenhuma ficha nasce ou muda por causa de estoque próprio.** O
   catálogo cresce pelo uso real — busca, instalação — nunca pelo que a
   TOKA tem para vender.

## Consequências

- Qualquer mudança em `peca.ts` ou `buscar.get.ts` que precise
  referenciar `anuncio` tem que primeiro apagar ou reescrever o
  teste-tripwire — a fricção aqui é deliberada, não um esquecimento.
- Completar o teste comportamental (hoje `.todo`) é parte do "pronto
  quando" da etapa 7, não um extra opcional.
- As regras 1, 2 e 4 não têm reforço automatizado — dependem de revisão
  humana ou de agente em todo PR que toque `anuncio` ou a página de
  classificados.
