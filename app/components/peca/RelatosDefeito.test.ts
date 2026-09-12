import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RelatosDefeito from './RelatosDefeito.vue'

describe('RelatosDefeito', () => {
  it('mostra as barras com percentual quando o modo é estatística', () => {
    const wrapper = mount(RelatosDefeito, {
      props: {
        relatosDefeito: {
          modo: 'estatistica',
          totalElegiveis: 312,
          relatos: [
            { texto: 'Batente superior rangendo', percentual: 18 },
            { texto: 'Rosca travando ao regular', percentual: 11 }
          ]
        }
      }
    })

    expect(wrapper.text()).toContain('312 registros')
    expect(wrapper.text()).toContain('Batente superior rangendo')
    expect(wrapper.text()).toContain('18%')
    expect(wrapper.text()).toContain('11%')
  })

  it('mostra os textos crus quando o modo é cru', () => {
    const wrapper = mount(RelatosDefeito, {
      props: {
        relatosDefeito: { modo: 'cru', textos: ['Rangeu um pouco', 'Vazou óleo'] }
      }
    })

    expect(wrapper.text()).toContain('Rangeu um pouco')
    expect(wrapper.text()).toContain('Vazou óleo')
    expect(wrapper.find('.text-mute.text-xs').exists()).toBe(false)
  })

  it('mostra estado vazio quando não há nenhum relato', () => {
    const wrapper = mount(RelatosDefeito, {
      props: { relatosDefeito: { modo: 'cru', textos: [] } }
    })

    expect(wrapper.text()).toContain('Nenhum relato de defeito registrado ainda.')
  })
})
