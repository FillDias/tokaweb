import { and, eq } from 'drizzle-orm'
import { db, conta, usuario } from '~~/server/database'

export type PerfilProvedor = {
  idExterno: string
  email?: string | null
  nome?: string | null
  avatarUrl?: string | null
}

const CAMPOS_USUARIO = {
  id: usuario.id,
  email: usuario.email,
  nome: usuario.nome,
  avatarUrl: usuario.avatarUrl
}

export async function buscarUsuarioPorConta(provedor: string, idExterno: string) {
  const [resultado] = await db
    .select(CAMPOS_USUARIO)
    .from(conta)
    .innerJoin(usuario, eq(conta.usuarioId, usuario.id))
    .where(and(eq(conta.provedor, provedor), eq(conta.idExterno, idExterno)))
    .limit(1)

  return resultado
}

export async function criarUsuarioComConta(provedor: string, perfil: PerfilProvedor) {
  return db.transaction(async (tx) => {
    const [novoUsuario] = await tx
      .insert(usuario)
      .values({
        email: perfil.email ?? null,
        nome: perfil.nome ?? null,
        avatarUrl: perfil.avatarUrl ?? null
      })
      .returning(CAMPOS_USUARIO)

    await tx.insert(conta).values({
      usuarioId: novoUsuario.id,
      provedor,
      idExterno: perfil.idExterno
    })

    return novoUsuario
  })
}

// não tenta casar por email entre provedores diferentes — Line às
// vezes nem devolve email (ver CONTEXT.md). Sem conta existente,
// cada login novo cria um usuario novo
export async function entrarOuCriarUsuario(provedor: string, perfil: PerfilProvedor) {
  const existente = await buscarUsuarioPorConta(provedor, perfil.idExterno)
  if (existente) return existente

  return criarUsuarioComConta(provedor, perfil)
}
