import { eq } from 'drizzle-orm'
import { db, peca } from '~~/server/database'

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
