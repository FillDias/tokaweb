import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const PECA_ID = '11111111-1111-4111-8111-111111111111'

mockNuxtImport('useRoute', () => () => ({ path: '/peca/exemplo-abc123', query: { instalado: '1' } }))

describe('BlocoInstalarPeca, voltando de um registro com sucesso', () => {
  it('mostra a confirmação', async () => {
    const BlocoInstalarPeca = (await import('./BlocoInstalarPeca.vue')).default
    const wrapper = mount(BlocoInstalarPeca, { props: { pecaId: PECA_ID } })

    expect(wrapper.text()).toContain('Instalação registrada')
  })
})
