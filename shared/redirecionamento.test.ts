import { describe, expect, it } from 'vitest'
import { caminhoInternoSeguro } from './redirecionamento'

describe('caminhoInternoSeguro', () => {
  it('aceita caminho interno', () => {
    expect(caminhoInternoSeguro('/peca/vst88c1ss3')).toBe('/peca/vst88c1ss3')
  })

  it('rejeita URL absoluta', () => {
    expect(caminhoInternoSeguro('https://evil.com')).toBeNull()
  })

  it('rejeita protocolo-relativa', () => {
    expect(caminhoInternoSeguro('//evil.com')).toBeNull()
  })

  it('rejeita valor que não é string', () => {
    expect(caminhoInternoSeguro(undefined)).toBeNull()
    expect(caminhoInternoSeguro(['/a'])).toBeNull()
  })
})
