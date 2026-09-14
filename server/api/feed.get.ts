import { buscarInstalacoesRecentes } from '~~/server/database/queries/instalacao'

const LIMITE_FEED = 30

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)

  return buscarInstalacoesRecentes(LIMITE_FEED, user?.id)
})
