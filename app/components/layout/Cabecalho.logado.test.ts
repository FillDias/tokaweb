import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { computed } from 'vue'

mockNuxtImport('useUserSession', () => {
  return () => ({
    loggedIn: computed(() => true),
    user: computed(() => ({ id: '1', nome: 'Fulano de Teste', email: null, avatarUrl: null }))
  })
})

describe('Cabecalho com sessão ativa', () => {
  it('mostra o nome do usuário e o botão Sair em vez do link Entrar', async () => {
    const Cabecalho = (await import('./Cabecalho.vue')).default
    const wrapper = mount(Cabecalho)

    expect(wrapper.find('[data-testid="cabecalho-usuario"]').text()).toBe('Fulano de Teste')
    expect(wrapper.text()).toContain('Sair')
    expect(wrapper.text()).not.toContain('Entrar')
  })
})
