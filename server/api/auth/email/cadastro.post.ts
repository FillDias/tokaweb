import { cadastroManualSchema } from '~~/shared/schemas'
import { buscarContaComSenha, buscarProvedorExistentePorEmail, criarUsuarioComConta } from '~~/server/database/queries/usuario'
import { hashSenha } from '~~/server/utils/senha'
import { enviarEmailConfirmacaoSeHabilitado } from '~~/server/utils/emailConfirmacao'
import { consumirRedirecionamento } from '~~/server/utils/redirecionamento'

export default defineEventHandler(async (event) => {
  const corpo = await readBody(event)
  const resultado = cadastroManualSchema.safeParse(corpo)

  if (!resultado.success) {
    return sendRedirect(event, '/cadastro?erro=validacao')
  }

  const { email, senha, cep, telefone } = resultado.data

  if (await buscarContaComSenha('email', email)) {
    return sendRedirect(event, '/cadastro?erro=email-em-uso')
  }

  const provedorConflitante = await buscarProvedorExistentePorEmail(email, 'email')
  if (provedorConflitante) {
    const emailCodificado = encodeURIComponent(email)
    return sendRedirect(event, `/cadastro?erro=email-existe&provedor=${provedorConflitante}&email=${emailCodificado}`)
  }

  const senhaHash = await hashSenha(senha)
  const novoUsuario = await criarUsuarioComConta('email', { idExterno: email, email, senhaHash, cep, telefone })

  await setUserSession(event, { user: novoUsuario })
  await enviarEmailConfirmacaoSeHabilitado(novoUsuario)

  return sendRedirect(event, consumirRedirecionamento(event))
})
