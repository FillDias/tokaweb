import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const POST_BASE = {
  id: '11111111-1111-4111-8111-111111111111',
  data: '2024-01-10',
  custo: '4890.00',
  oficina: 'Oficina Tanaka',
  nota: 4,
  oQueDeuErrado: 'Rebaixou 45mm sem raspar. Rangeu depois de 8 meses.',
  peca: { fabricante: 'TEIN', nome: 'Flex Z', codigo: 'VSTB8-C1SS3' },
  veiculo: { marca: 'Nissan', modelo: 'Silvia S13', dono: 'rafa.s13' },
  fotos: [],
  curtidas: 34,
  curtidoPorMim: false
}

mockNuxtImport('useRoute', () => () => ({ path: '/', query: {} }))

describe('CartaoPost, sem sessão', () => {
  it('mostra dono, peça, veículo, relato, nota, custo, oficina e curtidas — e o coração vira link de login', async () => {
    const CartaoPost = (await import('./CartaoPost.vue')).default
    const wrapper = mount(CartaoPost, { props: { post: POST_BASE } })

    expect(wrapper.text()).toContain('@rafa.s13')
    expect(wrapper.text()).toContain('TEIN Flex Z')
    expect(wrapper.text()).toContain('Nissan Silvia S13')
    expect(wrapper.text()).toContain('Rebaixou 45mm sem raspar')
    expect(wrapper.text()).toContain('★★★★☆')
    expect(wrapper.text()).toContain('R$')
    expect(wrapper.text()).toContain('Oficina Tanaka')
    expect(wrapper.text()).toContain('34 curtidas')

    const link = wrapper.find('a[href^="/entrar"]')
    expect(link.exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('link da peça vai pro slug certo', async () => {
    const CartaoPost = (await import('./CartaoPost.vue')).default
    const wrapper = mount(CartaoPost, { props: { post: POST_BASE } })

    const linkPeca = wrapper.findAll('a').find((a) => a.attributes('href')?.startsWith('/peca/'))
    expect(linkPeca?.attributes('href')).toBe('/peca/tein-flex-z-vstb8c1ss3')
  })
})
