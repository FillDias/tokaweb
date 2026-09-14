import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { eq, inArray } from 'drizzle-orm'
import { db, veiculo, peca, instalacao, usuario, curtida } from '~~/server/database'
import { buscarCurtidasDoUsuario, contarCurtidasPorInstalacoes, curtir, descurtir } from './curtida'

describe('curtir, descurtir e contagem', () => {
  let veiculoId: string
  let pecaId: string
  let instalacaoAId: string
  let instalacaoBId: string
  let usuarioId: string
  const codigoTeste = 'TOKA-TESTE-CURTIDA-A1'

  beforeAll(async () => {
    const [v] = await db
      .insert(veiculo)
      .values({ marca: 'TOKA QA', modelo: 'Veículo de teste', ano: 2000, motor: '1.0' })
      .returning({ id: veiculo.id })
    veiculoId = v.id

    const [p] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça pra teste de curtida', codigo: codigoTeste, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaId = p.id

    const linhas = await db
      .insert(instalacao)
      .values([
        { veiculoId, pecaId, data: '2024-01-10' },
        { veiculoId, pecaId, data: '2024-02-10' }
      ])
      .returning({ id: instalacao.id })
    instalacaoAId = linhas[0].id
    instalacaoBId = linhas[1].id

    const [u] = await db.insert(usuario).values({ nome: 'Fulano de Teste Curtida' }).returning({ id: usuario.id })
    usuarioId = u.id
  })

  afterAll(async () => {
    await db.delete(curtida).where(eq(curtida.usuarioId, usuarioId))
    await db.delete(usuario).where(eq(usuario.id, usuarioId))
    await db.delete(instalacao).where(inArray(instalacao.id, [instalacaoAId, instalacaoBId]))
    await db.delete(peca).where(eq(peca.id, pecaId))
    await db.delete(veiculo).where(eq(veiculo.id, veiculoId))
  })

  it('curtir soma uma curtida', async () => {
    await curtir(usuarioId, instalacaoAId)

    const totais = await contarCurtidasPorInstalacoes([instalacaoAId, instalacaoBId])
    expect(totais.get(instalacaoAId)).toBe(1)
    expect(totais.get(instalacaoBId)).toBeUndefined()
  })

  it('curtir de novo a mesma instalação não duplica (idempotente)', async () => {
    await curtir(usuarioId, instalacaoAId)
    await curtir(usuarioId, instalacaoAId)

    const totais = await contarCurtidasPorInstalacoes([instalacaoAId])
    expect(totais.get(instalacaoAId)).toBe(1)
  })

  it('buscarCurtidasDoUsuario diz quais dessas instalações o usuário já curtiu', async () => {
    const resultado = await buscarCurtidasDoUsuario(usuarioId, [instalacaoAId, instalacaoBId])

    expect(resultado.has(instalacaoAId)).toBe(true)
    expect(resultado.has(instalacaoBId)).toBe(false)
  })

  it('descurtir remove a curtida', async () => {
    await descurtir(usuarioId, instalacaoAId)

    const totais = await contarCurtidasPorInstalacoes([instalacaoAId])
    expect(totais.get(instalacaoAId)).toBeUndefined()
  })
})
