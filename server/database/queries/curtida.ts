import { and, eq, inArray, sql } from 'drizzle-orm'
import { db, curtida } from '~~/server/database'

// idempotente — clicar curtir duas vezes não duplica nem quebra
// (índice único cuida disso, mas evita a viagem ao banco à toa)
export async function curtir(usuarioId: string, instalacaoId: string) {
  await db.insert(curtida).values({ usuarioId, instalacaoId }).onConflictDoNothing()
}

export async function descurtir(usuarioId: string, instalacaoId: string) {
  await db.delete(curtida).where(and(eq(curtida.usuarioId, usuarioId), eq(curtida.instalacaoId, instalacaoId)))
}

export async function contarCurtidasPorInstalacoes(instalacaoIds: string[]): Promise<Map<string, number>> {
  if (instalacaoIds.length === 0) return new Map()

  const linhas = await db
    .select({ instalacaoId: curtida.instalacaoId, total: sql<number>`count(*)::int` })
    .from(curtida)
    .where(inArray(curtida.instalacaoId, instalacaoIds))
    .groupBy(curtida.instalacaoId)

  return new Map(linhas.map((l) => [l.instalacaoId, l.total]))
}

// quais dessas instalações o usuário logado já curtiu — pra desenhar
// o coração preenchido no cartão certo
export async function buscarCurtidasDoUsuario(usuarioId: string, instalacaoIds: string[]): Promise<Set<string>> {
  if (instalacaoIds.length === 0) return new Set()

  const linhas = await db
    .select({ instalacaoId: curtida.instalacaoId })
    .from(curtida)
    .where(and(eq(curtida.usuarioId, usuarioId), inArray(curtida.instalacaoId, instalacaoIds)))

  return new Set(linhas.map((l) => l.instalacaoId))
}
