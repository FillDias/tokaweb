import { z } from 'zod'
import { curtir, contarCurtidasPorInstalacoes } from '~~/server/database/queries/curtida'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const instalacaoId = z.uuid().parse(getRouterParam(event, 'id'))

  await curtir(user.id, instalacaoId)
  const totais = await contarCurtidasPorInstalacoes([instalacaoId])

  return { curtido: true, total: totais.get(instalacaoId) ?? 0 }
})
