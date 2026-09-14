import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const PECA_ID = '11111111-1111-4111-8111-111111111111'

mockNuxtImport('useRoute', () => () => ({ path: '/peca/exemplo-abc123', query: {} }))

describe('BlocoInstalarPeca, sem sessão', () => {
  it('mostra "Instalei essa peça" como link pro login, guardando a própria ficha como destino', async () => {
    const BlocoInstalarPeca = (await import('./BlocoInstalarPeca.vue')).default
    const wrapper = mount(BlocoInstalarPeca, { props: { pecaId: PECA_ID } })

    const link = wrapper.find('a')
    expect(link.text()).toBe('Instalei essa peça')
    expect(link.attributes('href')).toBe(`/entrar?redirect=${encodeURIComponent('/peca/exemplo-abc123')}`)
  })

  it('não mostra o formulário quando não está logado', async () => {
    const BlocoInstalarPeca = (await import('./BlocoInstalarPeca.vue')).default
    const wrapper = mount(BlocoInstalarPeca, { props: { pecaId: PECA_ID } })

    expect(wrapper.text()).not.toContain('Registrar instalação')
  })
})
