import { dispensarLembretePerfil } from '~~/server/database/queries/usuario'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  await dispensarLembretePerfil(user.id)
  await setUserSession(event, { user: { ...user, perfilLembreteDispensado: true } })

  return { ok: true }
})
