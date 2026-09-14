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

mockNuxtImport('useRoute', () => () => ({ path: '/peca/exemplo-abc123', query: {} }))

describe('BlocoInstalarPeca, logado', () => {
  // timeout maior — mount + import dinâmico do FormularioInstalacao é
  // pesado o bastante pra passar de 5s sob carga de suíte completa
  // (39 arquivos isolados), mesmo passando isolado em menos de 1s
  it(
    'mostra um botão que abre o formulário com o pecaId certo ao clicar, sem link de login',
    async () => {
      const BlocoInstalarPeca = (await import('./BlocoInstalarPeca.vue')).default
      const wrapper = mount(BlocoInstalarPeca, { props: { pecaId: PECA_ID } })

      expect(wrapper.find('a').exists()).toBe(false)
      expect(wrapper.text()).not.toContain('Registrar instalação')

      await wrapper.find('button').trigger('click')

      expect(wrapper.text()).toContain('Registrar instalação')
      expect(wrapper.find('input[name="pecaId"]').attributes('value')).toBe(PECA_ID)
    },
    15000
  )
})
