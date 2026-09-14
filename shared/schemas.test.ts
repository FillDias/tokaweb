import { describe, expect, it } from 'vitest'
import { cadastroManualSchema, loginManualSchema, instalacaoSchema } from './schemas'

const dadosValidos = {
  email: 'fulano@example.com',
  senha: 'senha1234',
  confirmarSenha: 'senha1234',
  cep: '01310-100',
  telefone: '11987654321'
}

describe('cadastroManualSchema', () => {
  it('aceita dados válidos', () => {
    expect(cadastroManualSchema.safeParse(dadosValidos).success).toBe(true)
  })

  it('rejeita quando a senha e a confirmação não batem', () => {
    const resultado = cadastroManualSchema.safeParse({ ...dadosValidos, confirmarSenha: 'outra12345' })

    expect(resultado.success).toBe(false)
  })

  it('rejeita senha curta', () => {
    const resultado = cadastroManualSchema.safeParse({ ...dadosValidos, senha: '123', confirmarSenha: '123' })

    expect(resultado.success).toBe(false)
  })

  it('rejeita CEP fora do formato', () => {
    const resultado = cadastroManualSchema.safeParse({ ...dadosValidos, cep: '123' })

    expect(resultado.success).toBe(false)
  })

  it('aceita CEP sem hífen', () => {
    const resultado = cadastroManualSchema.safeParse({ ...dadosValidos, cep: '01310100' })

    expect(resultado.success).toBe(true)
  })

  it('rejeita email inválido', () => {
    const resultado = cadastroManualSchema.safeParse({ ...dadosValidos, email: 'não é email' })

    expect(resultado.success).toBe(false)
  })
})

describe('loginManualSchema', () => {
  it('aceita email e senha preenchidos', () => {
    expect(loginManualSchema.safeParse({ email: 'a@b.com', senha: 'qualquer' }).success).toBe(true)
  })

  it('rejeita senha vazia', () => {
    expect(loginManualSchema.safeParse({ email: 'a@b.com', senha: '' }).success).toBe(false)
  })
})

describe('instalacaoSchema', () => {
  const dadosMinimos = {
    pecaId: '11111111-1111-4111-8111-111111111111',
    marca: 'Honda',
    modelo: 'Civic',
    ano: 2018,
    motor: '2.0 16V',
    data: '2024-01-10'
  }

  it('aceita só os campos obrigatórios — o resto é opcional', () => {
    const resultado = instalacaoSchema.safeParse(dadosMinimos)

    expect(resultado.success).toBe(true)
    expect(resultado.data?.km).toBeUndefined()
    expect(resultado.data?.custo).toBeUndefined()
    expect(resultado.data?.nota).toBeUndefined()
    expect(resultado.data?.compatibilidade).toBeUndefined()
  })

  it('aceita todos os campos preenchidos, vindos de formulário (tudo string)', () => {
    const resultado = instalacaoSchema.safeParse({
      ...dadosMinimos,
      km: '45000',
      custo: '890.50',
      oficina: 'Oficina do Zé',
      nota: '5',
      oQueDeuErrado: 'Nada até agora',
      compatibilidade: 'direto'
    })

    expect(resultado.success).toBe(true)
    expect(resultado.data).toMatchObject({ km: 45000, custo: 890.5, nota: 5, compatibilidade: 'direto' })
  })

  it('rejeita pecaId que não é uuid', () => {
    expect(instalacaoSchema.safeParse({ ...dadosMinimos, pecaId: 'não-é-uuid' }).success).toBe(false)
  })

  it('rejeita marca, modelo ou motor vazios', () => {
    expect(instalacaoSchema.safeParse({ ...dadosMinimos, marca: '' }).success).toBe(false)
    expect(instalacaoSchema.safeParse({ ...dadosMinimos, modelo: '  ' }).success).toBe(false)
    expect(instalacaoSchema.safeParse({ ...dadosMinimos, motor: '' }).success).toBe(false)
  })

  it('rejeita ano fora do razoável, aceita string vinda de formulário', () => {
    expect(instalacaoSchema.safeParse({ ...dadosMinimos, ano: '1899' }).success).toBe(false)
    expect(instalacaoSchema.safeParse({ ...dadosMinimos, ano: '2020' }).success).toBe(true)
  })

  it('rejeita data no futuro', () => {
    const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

    expect(instalacaoSchema.safeParse({ ...dadosMinimos, data: amanha }).success).toBe(false)
  })

  it('rejeita km negativo ou não inteiro', () => {
    expect(instalacaoSchema.safeParse({ ...dadosMinimos, km: '-10' }).success).toBe(false)
    expect(instalacaoSchema.safeParse({ ...dadosMinimos, km: '12.5' }).success).toBe(false)
  })

  it('rejeita nota fora de 1 a 5', () => {
    expect(instalacaoSchema.safeParse({ ...dadosMinimos, nota: '0' }).success).toBe(false)
    expect(instalacaoSchema.safeParse({ ...dadosMinimos, nota: '6' }).success).toBe(false)
  })

  it('rejeita compatibilidade fora do que a própria instalação pode declarar', () => {
    // sem_dados é derivado da ausência de relato, nunca escolhido — ver CONTEXT.md
    expect(instalacaoSchema.safeParse({ ...dadosMinimos, compatibilidade: 'sem_dados' }).success).toBe(false)
  })
})
