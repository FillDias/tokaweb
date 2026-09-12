import { buscarPecaPorCodigo } from '~~/server/database/queries/peca'
import { buscarEstatisticasPeca, buscarRelatosDefeito } from '~~/server/database/queries/instalacao'
import { normalizarCodigo } from '~~/shared/codigoNorm'

export default defineEventHandler(async (event) => {
  const codigo = getRouterParam(event, 'codigo')!
  const resultado = await buscarPecaPorCodigo(normalizarCodigo(codigo))

  if (!resultado) {
    throw createError({ statusCode: 404, statusMessage: 'Peça não encontrada' })
  }

  const [estatisticas, relatosDefeito] = await Promise.all([
    buscarEstatisticasPeca(resultado.id),
    buscarRelatosDefeito(resultado.id)
  ])

  return { ...resultado, estatisticas, relatosDefeito }
})
