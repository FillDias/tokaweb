import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { eq } from 'drizzle-orm'
import { db, veiculo, peca, instalacao } from '~~/server/database'
import { buscarEstatisticasPeca, buscarRelatosDefeito } from './instalacao'

function meseAtras(n: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  return d.toISOString().slice(0, 10)
}

describe('buscarEstatisticasPeca', () => {
  let veiculoId: string
  const codigoComDados = 'TOKA-TESTE-STATS-A1'
  const codigoSemRegistro = 'TOKA-TESTE-STATS-A2'
  let pecaComDadosId: string
  let pecaSemRegistroId: string

  beforeAll(async () => {
    const [v] = await db
      .insert(veiculo)
      .values({ marca: 'TOKA QA', modelo: 'Veículo de teste', ano: 2000 })
      .returning({ id: veiculo.id })
    veiculoId = v.id

    const [p1] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça com dados', codigo: codigoComDados, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaComDadosId = p1.id

    const [p2] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça sem registro', codigo: codigoSemRegistro, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaSemRegistroId = p2.id

    await db.insert(instalacao).values([
      { veiculoId, pecaId: pecaComDadosId, data: '2024-01-10', nota: 5, custo: '100.00' },
      { veiculoId, pecaId: pecaComDadosId, data: '2024-02-10', nota: 4, custo: '200.00' },
      { veiculoId, pecaId: pecaComDadosId, data: '2024-03-10', nota: 3, custo: '300.00' }
    ])
  })

  afterAll(async () => {
    await db.delete(instalacao).where(eq(instalacao.veiculoId, veiculoId))
    await db.delete(peca).where(eq(peca.codigo, codigoComDados))
    await db.delete(peca).where(eq(peca.codigo, codigoSemRegistro))
    await db.delete(veiculo).where(eq(veiculo.id, veiculoId))
  })

  it('calcula total de registros, nota média e preço médio', async () => {
    const resultado = await buscarEstatisticasPeca(pecaComDadosId)

    expect(resultado).toEqual({
      totalRegistros: 3,
      notaMedia: 4,
      precoMedio: 200
    })
  })

  it('retorna médias nulas quando a peça não tem nenhum registro', async () => {
    const resultado = await buscarEstatisticasPeca(pecaSemRegistroId)

    expect(resultado).toEqual({
      totalRegistros: 0,
      notaMedia: null,
      precoMedio: null
    })
  })
})

describe('buscarRelatosDefeito', () => {
  let veiculoId: string
  const codigoCru = 'TOKA-TESTE-DEFEITO-B1'
  const codigoEstatistica = 'TOKA-TESTE-DEFEITO-B2'
  let pecaCruId: string
  let pecaEstatisticaId: string

  beforeAll(async () => {
    const [v] = await db
      .insert(veiculo)
      .values({ marca: 'TOKA QA', modelo: 'Veículo de teste', ano: 2000 })
      .returning({ id: veiculo.id })
    veiculoId = v.id

    const [p1] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça poucos relatos', codigo: codigoCru, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaCruId = p1.id

    const [p2] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça com estatística', codigo: codigoEstatistica, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaEstatisticaId = p2.id

    // só 2 elegíveis (>6 meses) — abaixo do mínimo de 5
    await db.insert(instalacao).values([
      { veiculoId, pecaId: pecaCruId, data: meseAtras(8), oQueDeuErrado: 'Rangeu um pouco depois de uns meses' },
      { veiculoId, pecaId: pecaCruId, data: meseAtras(9), oQueDeuErrado: 'Vazou um pouco de óleo' }
    ])

    // 5 elegíveis (>6 meses) + 1 recente (não conta)
    await db.insert(instalacao).values([
      { veiculoId, pecaId: pecaEstatisticaId, data: meseAtras(12), oQueDeuErrado: 'Rangeu depois de uso' },
      { veiculoId, pecaId: pecaEstatisticaId, data: meseAtras(11), oQueDeuErrado: 'Rangeu depois de uso' },
      { veiculoId, pecaId: pecaEstatisticaId, data: meseAtras(10), oQueDeuErrado: 'Vazamento' },
      { veiculoId, pecaId: pecaEstatisticaId, data: meseAtras(9), oQueDeuErrado: 'Vazamento' },
      { veiculoId, pecaId: pecaEstatisticaId, data: meseAtras(7), oQueDeuErrado: null },
      { veiculoId, pecaId: pecaEstatisticaId, data: meseAtras(1), oQueDeuErrado: 'Não deveria contar, é recente' }
    ])
  })

  afterAll(async () => {
    await db.delete(instalacao).where(eq(instalacao.veiculoId, veiculoId))
    await db.delete(peca).where(eq(peca.codigo, codigoCru))
    await db.delete(peca).where(eq(peca.codigo, codigoEstatistica))
    await db.delete(veiculo).where(eq(veiculo.id, veiculoId))
  })

  it('mostra os textos crus quando tem menos de 5 registros maduros (>6 meses)', async () => {
    const resultado = await buscarRelatosDefeito(pecaCruId)

    expect(resultado.modo).toBe('cru')
    if (resultado.modo === 'cru') {
      expect(resultado.textos.sort()).toEqual([
        'Rangeu um pouco depois de uns meses',
        'Vazou um pouco de óleo'
      ].sort())
    }
  })

  it('calcula percentual só sobre registros com mais de 6 meses, ignorando o recente', async () => {
    const resultado = await buscarRelatosDefeito(pecaEstatisticaId)

    expect(resultado.modo).toBe('estatistica')
    if (resultado.modo === 'estatistica') {
      const ordenado = [...resultado.relatos].sort((a, b) => a.texto.localeCompare(b.texto))
      expect(ordenado).toEqual([
        { texto: 'Rangeu depois de uso', percentual: 40 },
        { texto: 'Vazamento', percentual: 40 }
      ])
    }
  })
})
