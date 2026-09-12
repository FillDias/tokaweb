import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { eq } from 'drizzle-orm'
import { db, peca } from '~~/server/database'
import { buscarPecaPorCodigo } from './peca'

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
