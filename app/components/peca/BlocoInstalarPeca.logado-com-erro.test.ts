import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { computed } from 'vue'

const PECA_ID = '11111111-1111-4111-8111-111111111111'

mockNuxtImport('useUserSession', () => {
  return () => ({
    loggedIn: computed(() => true),
    user: computed(() => ({ id: '1', nome: 'Fulano de Teste', email: null, avatarUrl: null }))
  })
})

mockNuxtImport('useRoute', () => () => ({
  path: '/peca/exemplo-abc123',
  query: { erro: 'instalacao-invalida' }
}))

describe('BlocoInstalarPeca, logado, voltando de um erro de validação', () => {
  it('já abre o formulário e mostra o aviso de erro', async () => {
    const BlocoInstalarPeca = (await import('./BlocoInstalarPeca.vue')).default
    const wrapper = mount(BlocoInstalarPeca, { props: { pecaId: PECA_ID } })

    expect(wrapper.text()).toContain('Não deu pra registrar')
    expect(wrapper.text()).toContain('Registrar instalação')
  })
})
