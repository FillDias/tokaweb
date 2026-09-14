import type { H3Event } from 'h3'
import {
  buscarProvedorExistentePorEmail,
  buscarUsuarioPorConta,
  criarUsuarioComConta,
  vincularConta,
  type PerfilProvedor
} from '~~/server/database/queries/usuario'
import { consumirRedirecionamento } from '~~/server/utils/redirecionamento'

// Ponto único de entrada pra login/vínculo social. Adicionar um
// provedor novo (ex.: apple) é só mapear o perfil dele pra
// PerfilProvedor e chamar essa função — nada aqui muda.
export async function processarLoginSocial(event: H3Event, provedor: string, perfil: PerfilProvedor) {
  const sessao = await getUserSession(event)
  const contaExistente = await buscarUsuarioPorConta(provedor, perfil.idExterno)

  // já logado: isso é "vincular provedor" a partir de /conta, não login
  if (sessao.user) {
    if (contaExistente && contaExistente.id !== sessao.user.id) {
      return sendRedirect(event, '/conta?erro=ja-vinculada')
    }
    if (!contaExistente) {
      await vincularConta(sessao.user.id, provedor, perfil.idExterno)
    }
    return sendRedirect(event, '/conta')
  }

  if (contaExistente) {
    await setUserSession(event, { user: contaExistente })
    return sendRedirect(event, consumirRedirecionamento(event))
  }

  // conta nova pro provedor: antes de criar usuario, checa se o email
  // já pertence a outro provedor — nunca casa contas sozinho
  if (perfil.email) {
    const provedorConflitante = await buscarProvedorExistentePorEmail(perfil.email, provedor)
    if (provedorConflitante) {
      const email = encodeURIComponent(perfil.email)
      return sendRedirect(event, `/entrar?erro=email-existe&provedor=${provedorConflitante}&email=${email}`)
    }
  }

  const novoUsuario = await criarUsuarioComConta(provedor, perfil)
  await setUserSession(event, { user: novoUsuario })
  return sendRedirect(event, consumirRedirecionamento(event))
}
