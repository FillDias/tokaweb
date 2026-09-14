import { describe, expect, it } from 'vitest'
import { hashSenha, verificarSenha } from './senha'

describe('hashSenha / verificarSenha', () => {
  it('verifica a senha certa contra o hash', async () => {
    const hash = await hashSenha('minhaSenha123')

    expect(await verificarSenha('minhaSenha123', hash)).toBe(true)
  })

  it('rejeita senha errada', async () => {
    const hash = await hashSenha('minhaSenha123')

    expect(await verificarSenha('senhaErrada', hash)).toBe(false)
  })

  it('gera hashes diferentes pra mesma senha (salt aleatório)', async () => {
    const hash1 = await hashSenha('minhaSenha123')
    const hash2 = await hashSenha('minhaSenha123')

    expect(hash1).not.toBe(hash2)
    expect(await verificarSenha('minhaSenha123', hash1)).toBe(true)
    expect(await verificarSenha('minhaSenha123', hash2)).toBe(true)
  })
})
