import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Regra 3 de docs/adr/0001-conflito-de-interesse-venda-propria.md: a
// TOKA vende peça própria nos classificados (etapa 7) no mesmo
// catálogo que ordena peça de terceiro. Se a busca/ranking pudesse
// enxergar "essa peça tem anúncio", o catálogo inteiro perde
// credibilidade no primeiro sinal de manipulação suspeitada — e não
// volta (PROJETO.md 7.4).
//
// Por isso estes dois arquivos NUNCA podem referenciar `anuncio`,
// direto ou indireto (import, JOIN, coluna calculada). Se você
// chegou aqui querendo apagar ou contornar este teste porque uma
// mudança legítima precisa tocar em anúncio dentro da busca — pare e
// leia o ADR primeiro. A regra é deliberada, não um esquecimento.
describe('regra anti-conflito: anúncio nunca influencia busca/ranking de peça', () => {
  // relativo à raiz do repo — é onde o vitest roda (vitest.config.ts)
  const ARQUIVOS_PROTEGIDOS = ['server/database/queries/peca.ts', 'server/api/buscar.get.ts']

  it.each(ARQUIVOS_PROTEGIDOS)('%s não referencia a tabela/palavra anuncio', (caminho) => {
    const codigo = readFileSync(caminho, 'utf-8')
    expect(codigo).not.toMatch(/anuncio/i)
  })

  // TODO(etapa 7): completar assim que a tabela `anuncio` existir.
  // Este é o teste que mais importa dos dois — o tripwire acima só
  // pega quem tenta pelo import direto; este pega qualquer caminho
  // que ninguém previu (coluna calculada em peca, trigger, view).
  //
  // Roteiro pra implementar:
  // 1. Seed de duas peças com o MESMO grau de relevância pro termo
  //    buscado (ex.: dois códigos igualmente parecidos via pg_trgm,
  //    ou o mesmo fabricante+nome com um caractere de diferença).
  // 2. Cria um `anuncio` pra uma delas com `vendaPropria: true`, ativo,
  //    com preço abaixo da média — o cenário mais tentador de
  //    favorecer, se a regra fosse violada.
  // 3. Roda a função de busca real (buscarPecaPorCodigo ou o que for
  //    a busca por similaridade) com um termo que dá match nas duas.
  // 4. Assert: a ordem/posição relativa das duas peças é a mesma antes
  //    e depois de criar o anuncio — compare contra uma busca de
  //    controle rodada ANTES de criar o anuncio, nunca contra uma
  //    ordem fixa escrita à mão (senão o teste só prova que a busca
  //    bate com o que você esperava, não que o anuncio é irrelevante).
  // 5. Limpar peça, anuncio e qualquer veiculo/instalacao usados no
  //    seed no afterAll.
  it.todo('peça com anúncio próprio ativo não muda de posição na busca em relação a uma peça igualmente relevante sem anúncio')
})
