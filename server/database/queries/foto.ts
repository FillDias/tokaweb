import { inArray } from 'drizzle-orm'
import { db, foto } from '~~/server/database'

export async function criarFotos(instalacaoId: string, chaves: string[]) {
  if (chaves.length === 0) return
  await db.insert(foto).values(chaves.map((chave) => ({ instalacaoId, chave })))
}

// devolve as chaves (não urls — quem chama decide se e quando assinar,
// ver server/utils/armazenamento.ts) agrupadas por instalação
export async function buscarChavesPorInstalacoes(instalacaoIds: string[]): Promise<Map<string, string[]>> {
  if (instalacaoIds.length === 0) return new Map()

  const linhas = await db
    .select({ instalacaoId: foto.instalacaoId, chave: foto.chave })
    .from(foto)
    .where(inArray(foto.instalacaoId, instalacaoIds))

  const porInstalacao = new Map<string, string[]>()
  for (const linha of linhas) {
    const atual = porInstalacao.get(linha.instalacaoId) ?? []
    atual.push(linha.chave)
    porInstalacao.set(linha.instalacaoId, atual)
  }

  return porInstalacao
}
