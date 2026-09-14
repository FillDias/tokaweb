import { and, eq, ne } from 'drizzle-orm'
import { db, conta, usuario } from '~~/server/database'

export type PerfilProvedor = {
  idExterno: string
  email?: string | null
  nome?: string | null
  avatarUrl?: string | null
  senhaHash?: string | null
  cep?: string | null
  telefone?: string | null
}

const CAMPOS_USUARIO = {
  id: usuario.id,
  email: usuario.email,
  nome: usuario.nome,
  avatarUrl: usuario.avatarUrl,
  cep: usuario.cep,
  telefone: usuario.telefone,
  perfilLembreteDispensado: usuario.perfilLembreteDispensado
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

// só usada no login manual — a única que precisa do hash pra
// comparar a senha digitada
export async function buscarContaComSenha(provedor: string, idExterno: string) {
  const [resultado] = await db
    .select({ ...CAMPOS_USUARIO, senhaHash: conta.senhaHash })
    .from(conta)
    .innerJoin(usuario, eq(conta.usuarioId, usuario.id))
    .where(and(eq(conta.provedor, provedor), eq(conta.idExterno, idExterno)))
    .limit(1)

  return resultado
}

export async function buscarUsuarioPorId(id: string) {
  const [resultado] = await db.select(CAMPOS_USUARIO).from(usuario).where(eq(usuario.id, id)).limit(1)
  return resultado
}

// nome do provedor de uma conta já existente com esse email, ignorando
// o provedor atual — usado pra avisar "esse email já tem conta pelo
// X" em vez de casar contas sozinho. Sem email pra comparar (Line),
// não tem conflito possível — quem chama já garante email presente
export async function buscarProvedorExistentePorEmail(email: string, provedorAtual: string) {
  const [resultado] = await db
    .select({ provedor: conta.provedor })
    .from(conta)
    .innerJoin(usuario, eq(conta.usuarioId, usuario.id))
    .where(and(eq(usuario.email, email), ne(conta.provedor, provedorAtual)))
    .limit(1)

  return resultado?.provedor
}

export async function criarUsuarioComConta(provedor: string, perfil: PerfilProvedor) {
  return db.transaction(async (tx) => {
    const [novoUsuario] = await tx
      .insert(usuario)
      .values({
        email: perfil.email ?? null,
        nome: perfil.nome ?? null,
        avatarUrl: perfil.avatarUrl ?? null,
        cep: perfil.cep ?? null,
        telefone: perfil.telefone ?? null
      })
      .returning(CAMPOS_USUARIO)

    await tx.insert(conta).values({
      usuarioId: novoUsuario.id,
      provedor,
      idExterno: perfil.idExterno,
      senhaHash: perfil.senhaHash ?? null
    })

    return novoUsuario
  })
}

// vincula um provedor a um usuario que já está logado — fluxo de
// "Minha conta". Não mexe em email/nome do usuario, só cria a conta.
// senhaHash só é usado ao vincular o provedor `email` (fluxo "Criar
// senha")
export async function vincularConta(usuarioId: string, provedor: string, idExterno: string, senhaHash?: string) {
  await db.insert(conta).values({ usuarioId, provedor, idExterno, senhaHash: senhaHash ?? null })
}

export async function listarContasPorUsuario(usuarioId: string) {
  return db
    .select({ provedor: conta.provedor, criadoEm: conta.criadoEm })
    .from(conta)
    .where(eq(conta.usuarioId, usuarioId))
    .orderBy(conta.criadoEm)
}

export async function atualizarPerfil(
  usuarioId: string,
  dados: { nome?: string; cep?: string; telefone?: string }
) {
  const [atualizado] = await db.update(usuario).set(dados).where(eq(usuario.id, usuarioId)).returning(CAMPOS_USUARIO)

  return atualizado
}

export async function dispensarLembretePerfil(usuarioId: string) {
  await db.update(usuario).set({ perfilLembreteDispensado: true }).where(eq(usuario.id, usuarioId))
}

// confirmação por email: esqueleto pronto, desligado por env var —
// ver server/utils/emailConfirmacao.ts e CONTEXT.md
export async function definirTokenConfirmacaoEmail(usuarioId: string, token: string, expiraEm: Date) {
  await db
    .update(usuario)
    .set({ tokenConfirmacaoEmail: token, tokenConfirmacaoExpiraEm: expiraEm })
    .where(eq(usuario.id, usuarioId))
}

export async function confirmarEmailPorToken(token: string): Promise<boolean> {
  const [encontrado] = await db
    .select({ id: usuario.id, expiraEm: usuario.tokenConfirmacaoExpiraEm })
    .from(usuario)
    .where(eq(usuario.tokenConfirmacaoEmail, token))
    .limit(1)

  if (!encontrado || !encontrado.expiraEm || encontrado.expiraEm < new Date()) return false

  await db
    .update(usuario)
    .set({ emailConfirmadoEm: new Date(), tokenConfirmacaoEmail: null, tokenConfirmacaoExpiraEm: null })
    .where(eq(usuario.id, encontrado.id))

  return true
}
