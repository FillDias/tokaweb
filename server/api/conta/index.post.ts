import { completarPerfilSchema } from '~~/shared/schemas'
import { atualizarPerfil } from '~~/server/database/queries/usuario'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const corpo = await readBody(event)

  const resultado = completarPerfilSchema.safeParse({ cep: corpo.cep, telefone: corpo.telefone })
  if (!resultado.success) {
    return sendRedirect(event, '/conta?erro=validacao')
  }

  const nome = typeof corpo.nome === 'string' && corpo.nome.trim() ? corpo.nome.trim() : undefined

  const atualizado = await atualizarPerfil(user.id, { nome, ...resultado.data })
  await setUserSession(event, { user: atualizado })

  return sendRedirect(event, '/conta')
})
