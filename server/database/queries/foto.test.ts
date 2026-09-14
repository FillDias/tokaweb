import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { eq, inArray } from 'drizzle-orm'
import { db, veiculo, peca, instalacao, foto } from '~~/server/database'
import { buscarChavesPorInstalacoes, criarFotos } from './foto'

describe('criarFotos e buscarChavesPorInstalacoes', () => {
  let veiculoId: string
  let pecaId: string
  let instalacaoComFotoId: string
  let instalacaoSemFotoId: string
  const codigoTeste = 'TOKA-TESTE-FOTO-A1'

  beforeAll(async () => {
    const [v] = await db
      .insert(veiculo)
      .values({ marca: 'TOKA QA', modelo: 'Veículo de teste', ano: 2000, motor: '1.0' })
      .returning({ id: veiculo.id })
    veiculoId = v.id

    const [p] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça pra teste de foto', codigo: codigoTeste, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaId = p.id

    const linhas = await db
      .insert(instalacao)
      .values([
        { veiculoId, pecaId, data: '2024-01-10' },
        { veiculoId, pecaId, data: '2024-02-10' }
      ])
      .returning({ id: instalacao.id })
    instalacaoComFotoId = linhas[0].id
    instalacaoSemFotoId = linhas[1].id
  })

  afterAll(async () => {
    await db.delete(foto).where(inArray(foto.instalacaoId, [instalacaoComFotoId, instalacaoSemFotoId]))
    await db.delete(instalacao).where(inArray(instalacao.id, [instalacaoComFotoId, instalacaoSemFotoId]))
    await db.delete(peca).where(eq(peca.id, pecaId))
    await db.delete(veiculo).where(eq(veiculo.id, veiculoId))
  })

  it('não faz nada quando a lista de chaves está vazia', async () => {
    await criarFotos(instalacaoSemFotoId, [])

    const resultado = await buscarChavesPorInstalacoes([instalacaoSemFotoId])
    expect(resultado.get(instalacaoSemFotoId)).toBeUndefined()
  })

  it('grava várias fotos pra mesma instalação e agrupa por instalação', async () => {
    await criarFotos(instalacaoComFotoId, ['instalacao/a.jpg', 'instalacao/b.jpg'])

    const resultado = await buscarChavesPorInstalacoes([instalacaoComFotoId, instalacaoSemFotoId])

    expect(resultado.get(instalacaoComFotoId)?.sort()).toEqual(['instalacao/a.jpg', 'instalacao/b.jpg'])
    expect(resultado.get(instalacaoSemFotoId)).toBeUndefined()
  })

  it('devolve mapa vazio quando não pede nenhuma instalação', async () => {
    const resultado = await buscarChavesPorInstalacoes([])
    expect(resultado.size).toBe(0)
  })
})
