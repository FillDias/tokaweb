import { describe, expect, it } from 'vitest'
import { extrairCodigoDoSlug, montarSlug } from './slug'

describe('extrairCodigoDoSlug', () => {
  it('extrai o código (codigo_norm) do último segmento do slug', () => {
    expect(extrairCodigoDoSlug('tein-flex-z-vstb8c1ss3')).toBe('VSTB8C1SS3')
  })

  it('funciona quando o slug é só o código, sem nome', () => {
    expect(extrairCodigoDoSlug('vstb8c1ss3')).toBe('VSTB8C1SS3')
  })
})

describe('montarSlug', () => {
  it('junta fabricante, nome e código normalizado em kebab-case', () => {
    expect(montarSlug('TEIN', 'Flex Z', 'VSTB8-C1SS3')).toBe('tein-flex-z-vstb8c1ss3')
  })

  it('remove acento', () => {
    expect(montarSlug('TOKA QA', 'Amortecedor Excêntrico', 'ABC123')).toBe('toka-qa-amortecedor-excentrico-abc123')
  })

  it('é a inversa de extrairCodigoDoSlug para o código normalizado', () => {
    const slug = montarSlug('TEIN', 'Flex Z', 'VSTB8-C1SS3')
    expect(extrairCodigoDoSlug(slug)).toBe('VSTB8C1SS3')
  })
})
