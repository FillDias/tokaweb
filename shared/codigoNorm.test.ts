import { describe, expect, it } from 'vitest'
import { normalizarCodigo } from './codigoNorm'

describe('normalizarCodigo', () => {
  it('remove hífen e deixa maiúsculo', () => {
    expect(normalizarCodigo('vstb8-c1ss3')).toBe('VSTB8C1SS3')
  })

  it('remove espaço e pontuação', () => {
    expect(normalizarCodigo('VST 88.C1/SS3')).toBe('VST88C1SS3')
  })
})
