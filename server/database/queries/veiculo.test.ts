import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { inArray } from 'drizzle-orm'
import { db, veiculo } from '~~/server/database'
import { listarAnos, listarMarcas, listarModelos, listarMotores } from './veiculo'

describe('cascata de veículo', () => {
  const marcaTeste = 'TOKA QA Nissan'
  let ids: string[]

  beforeAll(async () => {
    const linhas = await db
      .insert(veiculo)
      .values([
        { marca: marcaTeste, modelo: '180SX', ano: 1994, motor: 'SR20DET' },
        { marca: marcaTeste, modelo: '180SX', ano: 1994, motor: 'CA18DET' },
        { marca: marcaTeste, modelo: '180SX', ano: 1996, motor: 'SR20DET' },
        { marca: marcaTeste, modelo: 'Silvia S13', ano: 1990, motor: 'SR20DET' }
      ])
      .returning({ id: veiculo.id })
    ids = linhas.map((l) => l.id)
  })

  afterAll(async () => {
    await db.delete(veiculo).where(inArray(veiculo.id, ids))
  })

  it('lista marcas distintas', async () => {
    const marcas = await listarMarcas()

    expect(marcas).toContain(marcaTeste)
  })

  it('lista modelos distintos de uma marca', async () => {
    const modelos = await listarModelos(marcaTeste)

    expect(modelos.sort()).toEqual(['180SX', 'Silvia S13'])
  })

  it('lista anos distintos de marca+modelo', async () => {
    const anos = await listarAnos(marcaTeste, '180SX')

    expect(anos).toEqual([1994, 1996])
  })

  it('lista motores distintos de marca+modelo+ano', async () => {
    const motores = await listarMotores(marcaTeste, '180SX', 1994)

    expect(motores.sort()).toEqual(['CA18DET', 'SR20DET'])
  })

  it('retorna lista vazia quando a combinação não existe', async () => {
    const motores = await listarMotores(marcaTeste, '180SX', 1999)

    expect(motores).toEqual([])
  })
})
