import { describe, expect, it } from 'vitest'
import { extrairCodigoDoSlug } from './slug'

describe('extrairCodigoDoSlug', () => {
  it('extrai o código (codigo_norm) do último segmento do slug', () => {
    expect(extrairCodigoDoSlug('tein-flex-z-vstb8c1ss3')).toBe('VSTB8C1SS3')
  })

  it('funciona quando o slug é só o código, sem nome', () => {
    expect(extrairCodigoDoSlug('vstb8c1ss3')).toBe('VSTB8C1SS3')
  })
})
