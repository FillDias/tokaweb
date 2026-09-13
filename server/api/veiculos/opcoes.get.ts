import { listarAnos, listarMarcas, listarModelos, listarMotores } from '~~/server/database/queries/veiculo'

export default defineEventHandler(async (event) => {
  const { marca, modelo, ano } = getQuery(event)

  const marcas = await listarMarcas()
  const modelos = marca ? await listarModelos(String(marca)) : []
  const anos = marca && modelo ? await listarAnos(String(marca), String(modelo)) : []
  const motores = marca && modelo && ano ? await listarMotores(String(marca), String(modelo), Number(ano)) : []

  return { marcas, modelos, anos, motores }
})
