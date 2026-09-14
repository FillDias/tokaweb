import { loginManualSchema } from '~~/shared/schemas'
import { buscarContaComSenha } from '~~/server/database/queries/usuario'
import { verificarSenha } from '~~/server/utils/senha'
import { consumirRedirecionamento } from '~~/server/utils/redirecionamento'

export default defineEventHandler(async (event) => {
  const corpo = await readBody(event)
  const resultado = loginManualSchema.safeParse(corpo)

  if (!resultado.success) {
    return sendRedirect(event, '/entrar?erro=login-invalido')
  }

  const { email, senha } = resultado.data
  const contaEncontrada = await buscarContaComSenha('email', email)

  if (!contaEncontrada?.senhaHash || !(await verificarSenha(senha, contaEncontrada.senhaHash))) {
    return sendRedirect(event, '/entrar?erro=login-invalido')
  }

  const { senhaHash, ...usuarioLogado } = contaEncontrada
  await setUserSession(event, { user: usuarioLogado })

  return sendRedirect(event, consumirRedirecionamento(event))
})
