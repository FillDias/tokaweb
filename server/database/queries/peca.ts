import { eq, sql } from 'drizzle-orm'
import { db, peca } from '~~/server/database'

const LIMIAR_PROXIMAS = 0.1

export async function buscarPecaPorCodigo(codigoNorm: string) {
  const [resultado] = await db
    .select({
      id: peca.id,
      fabricante: peca.fabricante,
      nome: peca.nome,
      codigo: peca.codigo,
      categoria: peca.categoria
    })
    .from(peca)
    .where(eq(peca.codigoNorm, codigoNorm))
    .limit(1)

  return resultado
}

// usado quando a busca normal (pg_trgm.similarity_threshold, 0.3) não
// acha nada — sugere o que existe de mais parecido, mesmo abaixo do
// limiar normal, em vez de só dizer "não achei nada"
export async function buscarPecasProximas(codigoNorm: string, limite = 5) {
  return db
    .select({
      fabricante: peca.fabricante,
      nome: peca.nome,
      codigo: peca.codigo,
      score: sql<number>`round(similarity(${peca.codigoNorm}, ${codigoNorm})::numeric, 3)`
    })
    .from(peca)
    .where(sql`similarity(${peca.codigoNorm}, ${codigoNorm}) > ${LIMIAR_PROXIMAS}`)
    .orderBy(sql`similarity(${peca.codigoNorm}, ${codigoNorm}) DESC`)
    .limit(limite)
}
