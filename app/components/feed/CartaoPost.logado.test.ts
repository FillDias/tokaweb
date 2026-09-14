import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { computed } from 'vue'

const POST_BASE = {
  id: '11111111-1111-4111-8111-111111111111',
  data: '2024-01-10',
  custo: null,
  oficina: null,
  nota: null,
  oQueDeuErrado: null,
  peca: { fabricante: 'TEIN', nome: 'Flex Z', codigo: 'VSTB8-C1SS3' },
  veiculo: { marca: 'Nissan', modelo: 'Silvia S13', dono: 'rafa.s13' },
  fotos: [],
  curtidas: 34,
  curtidoPorMim: false
}

mockNuxtImport('useUserSession', () => {
  return () => ({
    loggedIn: computed(() => true),
    user: computed(() => ({ id: '1', nome: 'Fulano de Teste', email: null, avatarUrl: null }))
  })
})

mockNuxtImport('useRoute', () => () => ({ path: '/', query: {} }))

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn().mockResolvedValue({ curtido: true, total: 35 }) }))
mockNuxtImport('$fetch', () => fetchMock)

describe('CartaoPost, logado', () => {
  it('clicar no coração curte e atualiza o total, chamando POST', async () => {
    const CartaoPost = (await import('./CartaoPost.vue')).default
    const wrapper = mount(CartaoPost, { props: { post: POST_BASE } })

    expect(wrapper.find('a[href^="/entrar"]').exists()).toBe(false)

    await wrapper.find('button').trigger('click')

    expect(fetchMock).toHaveBeenCalledWith(`/api/instalacao/${POST_BASE.id}/curtida`, { method: 'POST' })
    expect(wrapper.text()).toContain('35 curtidas')
  })
})
