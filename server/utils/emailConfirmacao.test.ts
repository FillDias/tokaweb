import { afterEach, describe, expect, it } from 'vitest'
import { confirmacaoEmailHabilitada, enviarEmailConfirmacaoSeHabilitado } from './emailConfirmacao'

describe('confirmação por email — esqueleto desligado por padrão', () => {
  const chaveOriginal = process.env.RESEND_API_KEY

  afterEach(() => {
    process.env.RESEND_API_KEY = chaveOriginal
  })

  it('fica desabilitada quando RESEND_API_KEY não existe', () => {
    delete process.env.RESEND_API_KEY

    expect(confirmacaoEmailHabilitada()).toBe(false)
  })

  it('não faz nada (nem lança erro) quando desabilitada, mesmo com usuario válido', async () => {
    delete process.env.RESEND_API_KEY

    await expect(
      enviarEmailConfirmacaoSeHabilitado({ id: 'algum-id', email: 'a@b.com' })
    ).resolves.toBeUndefined()
  })

  it('fica habilitada quando RESEND_API_KEY existe', () => {
    process.env.RESEND_API_KEY = 'chave-de-teste'

    expect(confirmacaoEmailHabilitada()).toBe(true)
  })
})
