import { describe, expect, it } from 'vitest'
import { arquivoEhFotoValida, urlFoto } from './armazenamento'

describe('arquivoEhFotoValida', () => {
  it('aceita jpeg, png e webp dentro do tamanho', () => {
    const dado = Buffer.from('conteudo')
    expect(arquivoEhFotoValida({ data: dado, type: 'image/jpeg' })).toBe(true)
    expect(arquivoEhFotoValida({ data: dado, type: 'image/png' })).toBe(true)
    expect(arquivoEhFotoValida({ data: dado, type: 'image/webp' })).toBe(true)
  })

  it('rejeita tipo fora da lista', () => {
    expect(arquivoEhFotoValida({ data: Buffer.from('x'), type: 'application/pdf' })).toBe(false)
    expect(arquivoEhFotoValida({ data: Buffer.from('x'), type: 'image/gif' })).toBe(false)
  })

  it('rejeita sem tipo', () => {
    expect(arquivoEhFotoValida({ data: Buffer.from('x') })).toBe(false)
  })

  it('rejeita arquivo vazio', () => {
    expect(arquivoEhFotoValida({ data: Buffer.alloc(0), type: 'image/jpeg' })).toBe(false)
  })

  it('rejeita arquivo maior que 8 MB', () => {
    const grande = Buffer.alloc(8 * 1024 * 1024 + 1)
    expect(arquivoEhFotoValida({ data: grande, type: 'image/jpeg' })).toBe(false)
  })
})

describe('urlFoto', () => {
  it('monta uma url pública direta, sem assinatura', () => {
    const url = urlFoto('instalacao/abc123.jpg')

    expect(url.startsWith('http')).toBe(true)
    expect(url.endsWith('/instalacao/abc123.jpg')).toBe(true)
    expect(url).not.toContain('Signature=')
    expect(url).not.toContain('X-Amz-')
  })
})
