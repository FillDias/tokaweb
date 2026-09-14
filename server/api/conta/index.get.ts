import { listarContasPorUsuario } from '~~/server/database/queries/usuario'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const contas = await listarContasPorUsuario(user.id)

  return { usuario: user, contas }
})
