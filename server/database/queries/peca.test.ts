import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { eq, inArray } from 'drizzle-orm'
import { db, peca } from '~~/server/database'
import { buscarPecaPorCodigo, buscarPecasProximas } from './peca'

describe('buscarPecaPorCodigo', () => {
  const codigoTeste = 'TOKA-TESTE-9F3K2'

  beforeAll(async () => {
    await db.insert(peca).values({
      fabricante: 'TOKA QA',
      nome: 'Peça de teste automatizado',
      codigo: codigoTeste,
      categoria: 'teste'
    })
  })

  afterAll(async () => {
    await db.delete(peca).where(eq(peca.codigo, codigoTeste))
  })

  it('retorna a peça quando o codigo_norm bate exatamente', async () => {
    const resultado = await buscarPecaPorCodigo('TOKATESTE9F3K2')

    expect(resultado).toMatchObject({
      fabricante: 'TOKA QA',
      nome: 'Peça de teste automatizado',
      codigo: codigoTeste,
      categoria: 'teste'
    })
  })

  it('retorna undefined quando não existe peça com esse código', async () => {
    const resultado = await buscarPecaPorCodigo('CODIGO-QUE-NAO-EXISTE-XPTO')

    expect(resultado).toBeUndefined()
  })
})

describe('buscarPecasProximas', () => {
  const codigoParecido1 = 'TOKA-PROX-AB123'
  const codigoParecido2 = 'TOKA-PROX-AB124'
  const codigoDiferente = 'ZZZZZZZZZZ-NADA-VER'
  let ids: string[]

  beforeAll(async () => {
    const linhas = await db
      .insert(peca)
      .values([
        { fabricante: 'TOKA QA', nome: 'Parecida 1', codigo: codigoParecido1, categoria: 'teste' },
        { fabricante: 'TOKA QA', nome: 'Parecida 2', codigo: codigoParecido2, categoria: 'teste' },
        { fabricante: 'TOKA QA', nome: 'Bem diferente', codigo: codigoDiferente, categoria: 'teste' }
      ])
      .returning({ id: peca.id })
    ids = linhas.map((l) => l.id)
  })

  afterAll(async () => {
    await db.delete(peca).where(inArray(peca.id, ids))
  })

  it('sugere as peças mais parecidas com o termo, mesmo sem bater o limiar normal', async () => {
    const resultado = await buscarPecasProximas('TOKAPROXAB129')

    const codigos = resultado.map((r) => r.codigo)
    expect(codigos).toContain(codigoParecido1)
    expect(codigos).toContain(codigoParecido2)
    expect(codigos).not.toContain(codigoDiferente)
  })

  it('respeita o limite pedido', async () => {
    const resultado = await buscarPecasProximas('TOKAPROXAB129', 1)

    expect(resultado).toHaveLength(1)
  })

  it('retorna lista vazia quando não há nada nem remotamente parecido', async () => {
    const resultado = await buscarPecasProximas('QWXJZ9988776655')

    expect(resultado.map((r) => r.codigo)).not.toContain(codigoParecido1)
  })
})
