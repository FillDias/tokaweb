import { confirmarEmailPorToken } from '~~/server/database/queries/usuario'

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event)
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Token ausente' })
  }

  const confirmado = await confirmarEmailPorToken(String(token))
  return { confirmado }
})
