import { and, desc, eq, inArray, isNotNull, sql } from 'drizzle-orm'
import { db, instalacao, veiculo } from '~~/server/database'

type Compatibilidade = 'direto' | 'adaptacao' | 'nao_serve' | 'sem_dados'

const REGISTROS_MINIMOS_PARA_ESTATISTICA = 5

export async function buscarEstatisticasPeca(pecaId: string) {
  const [resultado] = await db
    .select({
      totalRegistros: sql<number>`count(*)::int`,
      notaMedia: sql<number | null>`round(avg(${instalacao.nota}), 1)::float`,
      precoMedio: sql<number | null>`round(avg(${instalacao.custo}), 2)::float`
    })
    .from(instalacao)
    .where(eq(instalacao.pecaId, pecaId))

  return resultado
}

type RelatosDefeito =
  | { modo: 'estatistica'; totalElegiveis: number; relatos: { texto: string; percentual: number }[] }
  | { modo: 'cru'; textos: string[] }

export async function buscarRelatosDefeito(pecaId: string): Promise<RelatosDefeito> {
  // percentual só sobre registros com mais de 6 meses de uso — peça
  // recém-instalada ainda não teve tempo de dar defeito (ver mockup)
  const elegiveis = await db
    .select({ oQueDeuErrado: instalacao.oQueDeuErrado })
    .from(instalacao)
    .where(
      and(
        eq(instalacao.pecaId, pecaId),
        sql`${instalacao.data} <= current_date - interval '6 months'`
      )
    )

  const comTexto = elegiveis
    .map((r) => r.oQueDeuErrado?.trim())
    .filter((texto): texto is string => !!texto)

  if (elegiveis.length < REGISTROS_MINIMOS_PARA_ESTATISTICA) {
    return { modo: 'cru', textos: comTexto }
  }

  const contagem = new Map<string, number>()
  for (const texto of comTexto) {
    contagem.set(texto, (contagem.get(texto) ?? 0) + 1)
  }

  const relatos = [...contagem.entries()]
    .map(([texto, n]) => ({
      texto,
      percentual: Math.round((n / elegiveis.length) * 1000) / 10
    }))
    .sort((a, b) => b.percentual - a.percentual || a.texto.localeCompare(b.texto))

  return { modo: 'estatistica', totalElegiveis: elegiveis.length, relatos }
}

export async function buscarInstalacoesPeca(pecaId: string) {
  return db
    .select({
      id: instalacao.id,
      data: instalacao.data,
      km: instalacao.km,
      custo: instalacao.custo,
      oficina: instalacao.oficina,
      nota: instalacao.nota,
      oQueDeuErrado: instalacao.oQueDeuErrado,
      veiculo: {
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        ano: veiculo.ano,
        motor: veiculo.motor,
        dono: veiculo.dono
      }
    })
    .from(instalacao)
    .innerJoin(veiculo, eq(instalacao.veiculoId, veiculo.id))
    .where(eq(instalacao.pecaId, pecaId))
    .orderBy(desc(instalacao.data))
}

export async function buscarCompatibilidadeEmLote(
  pecaIds: string[],
  veiculoAtivo: { marca: string; modelo: string; motor: string }
): Promise<Record<string, Compatibilidade>> {
  if (pecaIds.length === 0) return {}

  const linhas = await db
    .select({ pecaId: instalacao.pecaId, compatibilidade: instalacao.compatibilidade })
    .from(instalacao)
    .innerJoin(veiculo, eq(instalacao.veiculoId, veiculo.id))
    .where(
      and(
        inArray(instalacao.pecaId, pecaIds),
        eq(veiculo.marca, veiculoAtivo.marca),
        eq(veiculo.modelo, veiculoAtivo.modelo),
        eq(veiculo.motor, veiculoAtivo.motor),
        isNotNull(instalacao.compatibilidade)
      )
    )

  const porPeca = new Map<string, Set<string>>()
  for (const linha of linhas) {
    const atual = porPeca.get(linha.pecaId) ?? new Set()
    atual.add(linha.compatibilidade!)
    porPeca.set(linha.pecaId, atual)
  }

  const resultado: Record<string, Compatibilidade> = {}
  for (const pecaId of pecaIds) {
    const relatados = porPeca.get(pecaId)
    // "não serve" avisa antes: um relato de incompatibilidade pesa mais
    // que vários de encaixe direto, é dinheiro e tempo de quem instala
    resultado[pecaId] = !relatados
      ? 'sem_dados'
      : relatados.has('nao_serve')
        ? 'nao_serve'
        : relatados.has('direto')
          ? 'direto'
          : relatados.has('adaptacao')
            ? 'adaptacao'
            : 'sem_dados'
  }

  return resultado
}
