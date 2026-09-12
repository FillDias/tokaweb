import { sql } from 'drizzle-orm'
import { db, peca } from '~~/server/database'
import { normalizarCodigo } from '~~/shared/codigoNorm'
import { buscarCompatibilidadeEmLote } from '~~/server/database/queries/instalacao'
import type { VeiculoAtivo } from '~~/shared/veiculo'

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)
  if (!q) return []

  const termo = normalizarCodigo(String(q))

  const resultados = await db
    .select({
      id:         peca.id,
      fabricante: peca.fabricante,
      nome:       peca.nome,
      codigo:     peca.codigo,
      score:      sql<number>`round(similarity(${peca.codigoNorm}, ${termo})::numeric, 3)`
    })
    .from(peca)
    .where(sql`${peca.codigoNorm} % ${termo}`)
    .orderBy(sql`similarity(${peca.codigoNorm}, ${termo}) DESC`)
    .limit(20)

  const veiculoAtivo = lerVeiculoAtivo(getCookie(event, 'veiculo-ativo'))
  const compatibilidade = veiculoAtivo
    ? await buscarCompatibilidadeEmLote(resultados.map((r) => r.id), veiculoAtivo)
    : {}

  return resultados.map(({ id, ...resto }) => ({
    ...resto,
    compatibilidade: compatibilidade[id] ?? 'sem_dados'
  }))
})

function lerVeiculoAtivo(cookie: string | undefined): VeiculoAtivo | null {
  if (!cookie) return null
  try {
    return JSON.parse(cookie)
  } catch {
    return null
  }
}