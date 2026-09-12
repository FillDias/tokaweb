import { sql } from 'drizzle-orm'
import { db, peca } from '~~/server/database'
import { normalizarCodigo } from '~~/shared/codigoNorm'

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)
  if (!q) return []

  const termo = normalizarCodigo(String(q))

  return await db
    .select({
      fabricante: peca.fabricante,
      nome:       peca.nome,
      codigo:     peca.codigo,
      score:      sql<number>`round(similarity(${peca.codigoNorm}, ${termo})::numeric, 3)`
    })
    .from(peca)
    .where(sql`${peca.codigoNorm} % ${termo}`)
    .orderBy(sql`similarity(${peca.codigoNorm}, ${termo}) DESC`)
    .limit(20)
})