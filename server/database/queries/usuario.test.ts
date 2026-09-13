import { afterAll, describe, expect, it } from 'vitest'
import { eq } from 'drizzle-orm'
import { db, conta, usuario } from '~~/server/database'
import { buscarUsuarioPorConta, criarUsuarioComConta, entrarOuCriarUsuario } from './usuario'

describe('autenticação por provedor', () => {
  const idsUsuarioParaLimpar: string[] = []

  afterAll(async () => {
    for (const id of idsUsuarioParaLimpar) {
      await db.delete(conta).where(eq(conta.usuarioId, id))
      await db.delete(usuario).where(eq(usuario.id, id))
    }
  })

  it('cria usuario e conta vinculada quando não existe conta pro provedor+id', async () => {
    const criado = await criarUsuarioComConta('google', {
      idExterno: 'google-teste-1',
      email: 'teste@example.com',
      nome: 'Fulano de Teste',
      avatarUrl: 'https://exemplo.com/avatar.png'
    })
    idsUsuarioParaLimpar.push(criado.id)

    expect(criado).toMatchObject({
      email: 'teste@example.com',
      nome: 'Fulano de Teste',
      avatarUrl: 'https://exemplo.com/avatar.png'
    })

    const [contaCriada] = await db.select().from(conta).where(eq(conta.usuarioId, criado.id))
    expect(contaCriada).toMatchObject({ provedor: 'google', idExterno: 'google-teste-1' })
  })

  it('cria usuario sem email quando o provedor não devolve (caso Line)', async () => {
    const criado = await criarUsuarioComConta('line', {
      idExterno: 'line-teste-1',
      nome: 'Sem Email'
    })
    idsUsuarioParaLimpar.push(criado.id)

    expect(criado.email).toBeNull()
    expect(criado.nome).toBe('Sem Email')
  })

  it('buscarUsuarioPorConta acha o usuario pela combinação provedor+id_externo', async () => {
    const criado = await criarUsuarioComConta('google', { idExterno: 'google-teste-2', email: 'a@b.com' })
    idsUsuarioParaLimpar.push(criado.id)

    const encontrado = await buscarUsuarioPorConta('google', 'google-teste-2')

    expect(encontrado).toMatchObject({ id: criado.id, email: 'a@b.com' })
  })

  it('buscarUsuarioPorConta não encontra nada pra id_externo de outro provedor', async () => {
    const criado = await criarUsuarioComConta('google', { idExterno: 'google-teste-3' })
    idsUsuarioParaLimpar.push(criado.id)

    const encontrado = await buscarUsuarioPorConta('line', 'google-teste-3')

    expect(encontrado).toBeUndefined()
  })

  it('entrarOuCriarUsuario reaproveita o usuario existente em vez de duplicar', async () => {
    const primeiro = await entrarOuCriarUsuario('google', { idExterno: 'google-teste-4', nome: 'Primeira vez' })
    idsUsuarioParaLimpar.push(primeiro.id)

    const segundo = await entrarOuCriarUsuario('google', { idExterno: 'google-teste-4', nome: 'Segunda vez' })

    expect(segundo.id).toBe(primeiro.id)
    expect(segundo.nome).toBe('Primeira vez')
  })

  it('entrarOuCriarUsuario cria usuarios separados pra provedores diferentes, mesmo com o mesmo email', async () => {
    const viaGoogle = await entrarOuCriarUsuario('google', { idExterno: 'google-teste-5', email: 'mesmo@email.com' })
    idsUsuarioParaLimpar.push(viaGoogle.id)

    const viaLine = await entrarOuCriarUsuario('line', { idExterno: 'line-teste-5', email: 'mesmo@email.com' })
    idsUsuarioParaLimpar.push(viaLine.id)

    expect(viaLine.id).not.toBe(viaGoogle.id)
  })
})
