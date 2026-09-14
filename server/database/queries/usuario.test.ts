import { afterAll, describe, expect, it } from 'vitest'
import { eq } from 'drizzle-orm'
import { db, conta, usuario } from '~~/server/database'
import {
  atualizarPerfil,
  buscarContaComSenha,
  buscarProvedorExistentePorEmail,
  buscarUsuarioPorConta,
  buscarUsuarioPorId,
  confirmarEmailPorToken,
  criarUsuarioComConta,
  definirTokenConfirmacaoEmail,
  dispensarLembretePerfil,
  listarContasPorUsuario,
  vincularConta
} from './usuario'

describe('usuario e conta', () => {
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
      avatarUrl: 'https://exemplo.com/avatar.png',
      perfilLembreteDispensado: false
    })

    const [contaCriada] = await db.select().from(conta).where(eq(conta.usuarioId, criado.id))
    expect(contaCriada).toMatchObject({ provedor: 'google', idExterno: 'google-teste-1', senhaHash: null })
  })

  it('cria usuario sem email quando o provedor não devolve (caso Line)', async () => {
    const criado = await criarUsuarioComConta('line', { idExterno: 'line-teste-1', nome: 'Sem Email' })
    idsUsuarioParaLimpar.push(criado.id)

    expect(criado.email).toBeNull()
  })

  it('cria conta com senha (cadastro manual, provedor email)', async () => {
    const criado = await criarUsuarioComConta('email', {
      idExterno: 'manual@example.com',
      email: 'manual@example.com',
      senhaHash: 'salt:chave'
    })
    idsUsuarioParaLimpar.push(criado.id)

    const contaComSenha = await buscarContaComSenha('email', 'manual@example.com')
    expect(contaComSenha).toMatchObject({ id: criado.id, senhaHash: 'salt:chave' })
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

    expect(await buscarUsuarioPorConta('line', 'google-teste-3')).toBeUndefined()
  })

  it('buscarProvedorExistentePorEmail acha outro provedor com o mesmo email', async () => {
    const criado = await criarUsuarioComConta('google', { idExterno: 'google-teste-6', email: 'conflito@e.com' })
    idsUsuarioParaLimpar.push(criado.id)

    const provedor = await buscarProvedorExistentePorEmail('conflito@e.com', 'line')

    expect(provedor).toBe('google')
  })

  it('buscarProvedorExistentePorEmail ignora o próprio provedor', async () => {
    const criado = await criarUsuarioComConta('google', { idExterno: 'google-teste-7', email: 'igual@e.com' })
    idsUsuarioParaLimpar.push(criado.id)

    const provedor = await buscarProvedorExistentePorEmail('igual@e.com', 'google')

    expect(provedor).toBeUndefined()
  })

  it('vincularConta adiciona um provedor novo a um usuario já existente', async () => {
    const criado = await criarUsuarioComConta('google', { idExterno: 'google-teste-8' })
    idsUsuarioParaLimpar.push(criado.id)

    await vincularConta(criado.id, 'line', 'line-teste-8')

    const contas = await listarContasPorUsuario(criado.id)
    expect(contas.map((c) => c.provedor).sort()).toEqual(['google', 'line'])
  })

  it('atualizarPerfil muda cep e telefone', async () => {
    const criado = await criarUsuarioComConta('google', { idExterno: 'google-teste-9' })
    idsUsuarioParaLimpar.push(criado.id)

    const atualizado = await atualizarPerfil(criado.id, { cep: '01310-100', telefone: '11987654321' })

    expect(atualizado).toMatchObject({ cep: '01310-100', telefone: '11987654321' })
  })

  it('dispensarLembretePerfil marca o campo como true', async () => {
    const criado = await criarUsuarioComConta('google', { idExterno: 'google-teste-10' })
    idsUsuarioParaLimpar.push(criado.id)

    await dispensarLembretePerfil(criado.id)

    const atualizado = await buscarUsuarioPorId(criado.id)
    expect(atualizado?.perfilLembreteDispensado).toBe(true)
  })

  it('confirmarEmailPorToken confirma quando o token é válido e não expirou', async () => {
    const criado = await criarUsuarioComConta('google', { idExterno: 'google-teste-11', email: 'a@b.com' })
    idsUsuarioParaLimpar.push(criado.id)

    const expiraEm = new Date(Date.now() + 60 * 60 * 1000)
    await definirTokenConfirmacaoEmail(criado.id, 'token-valido', expiraEm)

    expect(await confirmarEmailPorToken('token-valido')).toBe(true)

    const [linha] = await db.select().from(usuario).where(eq(usuario.id, criado.id))
    expect(linha.emailConfirmadoEm).not.toBeNull()
    expect(linha.tokenConfirmacaoEmail).toBeNull()
  })

  it('confirmarEmailPorToken recusa token expirado', async () => {
    const criado = await criarUsuarioComConta('google', { idExterno: 'google-teste-12' })
    idsUsuarioParaLimpar.push(criado.id)

    const jaExpirou = new Date(Date.now() - 60 * 60 * 1000)
    await definirTokenConfirmacaoEmail(criado.id, 'token-expirado', jaExpirou)

    expect(await confirmarEmailPorToken('token-expirado')).toBe(false)
  })

  it('confirmarEmailPorToken recusa token que não existe', async () => {
    expect(await confirmarEmailPorToken('token-que-nao-existe')).toBe(false)
  })
})
