import { describe, expect, it } from 'vitest'
import { nomeProvedor } from './provedores'

describe('nomeProvedor', () => {
  it('traduz os provedores conhecidos', () => {
    expect(nomeProvedor('google')).toBe('Google')
    expect(nomeProvedor('line')).toBe('Line')
    expect(nomeProvedor('apple')).toBe('Apple')
    expect(nomeProvedor('email')).toBe('Email e senha')
  })

  it('devolve o próprio valor quando o provedor é desconhecido', () => {
    expect(nomeProvedor('desconhecido')).toBe('desconhecido')
  })
})
