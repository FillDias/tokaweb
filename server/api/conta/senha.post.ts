import { criarSenhaSchema } from '~~/shared/schemas'
import { buscarContaComSenha, vincularConta } from '~~/server/database/queries/usuario'
import { hashSenha } from '~~/server/utils/senha'

// "Criar senha" em Minha conta — deixa quem entrou só por social
// também poder entrar com email e senha. Ver Tela 7 em
// docs/design/AUTENTICACAO.md
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (!user.email) {
    return sendRedirect(event, '/conta?erro=sem-email')
  }

  const corpo = await readBody(event)
  const resultado = criarSenhaSchema.safeParse(corpo)
  if (!resultado.success) {
    return sendRedirect(event, '/conta?erro=validacao-senha')
  }

  const contaEmailExistente = await buscarContaComSenha('email', user.email)
  if (contaEmailExistente) {
    return sendRedirect(event, '/conta?erro=ja-vinculada')
  }

  const senhaHash = await hashSenha(resultado.data.senha)
  await vincularConta(user.id, 'email', user.email, senhaHash)

  return sendRedirect(event, '/conta?vinculado=1')
})
