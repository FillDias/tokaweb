import { z } from 'zod'
import { descurtir, contarCurtidasPorInstalacoes } from '~~/server/database/queries/curtida'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const instalacaoId = z.uuid().parse(getRouterParam(event, 'id'))

  await descurtir(user.id, instalacaoId)
  const totais = await contarCurtidasPorInstalacoes([instalacaoId])

  return { curtido: false, total: totais.get(instalacaoId) ?? 0 }
})
