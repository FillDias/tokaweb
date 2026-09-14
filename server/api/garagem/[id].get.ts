import { buscarVeiculoPorId } from '~~/server/database/queries/veiculo'
import { buscarModificacoesPorVeiculo } from '~~/server/database/queries/instalacao'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const veiculo = await buscarVeiculoPorId(id)

  if (!veiculo) {
    throw createError({ statusCode: 404, statusMessage: 'Veículo não encontrado' })
  }

  const modificacoes = await buscarModificacoesPorVeiculo(veiculo.id)

  const porSistema = new Map<string, typeof modificacoes>()
  for (const modificacao of modificacoes) {
    const lista = porSistema.get(modificacao.peca.categoria) ?? []
    lista.push(modificacao)
    porSistema.set(modificacao.peca.categoria, lista)
  }

  return {
    ...veiculo,
    sistemas: [...porSistema.entries()].map(([categoria, itens]) => ({ categoria, itens }))
  }
})
