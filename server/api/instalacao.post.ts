import { z } from 'zod'
import { instalacaoSchema } from '~~/shared/schemas'
import { montarSlug } from '~~/shared/slug'
import { buscarPecaPorId } from '~~/server/database/queries/peca'
import { buscarOuCriarVeiculo } from '~~/server/database/queries/veiculo'
import { criarInstalacao } from '~~/server/database/queries/instalacao'
import { criarFotos } from '~~/server/database/queries/foto'
import { arquivoEhFotoValida, enviarFoto } from '~~/server/utils/armazenamento'

// primeiro lugar que exige login — ver "É aqui que entra login pela
// primeira vez" no PLANO.md, etapa 5
export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  // multipart porque o formulário manda fotos junto — ver
  // FormularioInstalacao.vue. Campos de texto e arquivos vêm
  // misturados nas partes, separa pelo nome de arquivo
  const partes = await readMultipartFormData(event)
  const corpo: Record<string, string> = {}
  const arquivos: { data: Buffer; type?: string }[] = []

  for (const parte of partes ?? []) {
    if (parte.filename) {
      if (parte.data.length > 0) arquivos.push({ data: parte.data, type: parte.type })
    } else if (parte.name) {
      corpo[parte.name] = parte.data.toString('utf-8')
    }
  }

  const pecaIdValido = z.uuid().safeParse(corpo.pecaId)
  const peca = pecaIdValido.success ? await buscarPecaPorId(pecaIdValido.data) : undefined

  // sem a peça não tem ficha pra voltar — só acontece com POST malformado
  if (!peca) return sendRedirect(event, '/')

  const slugFicha = `/peca/${montarSlug(peca.fabricante, peca.nome, peca.codigo)}`

  const resultado = instalacaoSchema.safeParse(corpo)
  if (!resultado.success) {
    return sendRedirect(event, `${slugFicha}?erro=instalacao-invalida`)
  }

  if (arquivos.some((arquivo) => !arquivoEhFotoValida(arquivo))) {
    return sendRedirect(event, `${slugFicha}?erro=foto-invalida`)
  }

  const { marca, modelo, ano, motor, ...dadosInstalacao } = resultado.data
  const veiculoId = await buscarOuCriarVeiculo({ marca, modelo, ano, motor })

  const criada = await criarInstalacao({ ...dadosInstalacao, veiculoId })

  if (arquivos.length > 0) {
    const chaves = await Promise.all(arquivos.map(enviarFoto))
    await criarFotos(criada.id, chaves)
  }

  return sendRedirect(event, `${slugFicha}?instalado=1`)
})
