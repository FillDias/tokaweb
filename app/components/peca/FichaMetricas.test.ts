import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FichaMetricas from './FichaMetricas.vue'

describe('FichaMetricas', () => {
  it('mostra o total de registros, a nota e o preço médio', () => {
    const wrapper = mount(FichaMetricas, {
      props: {
        estatisticas: { totalRegistros: 312, notaMedia: 4.4, precoMedio: 4890 }
      }
    })

    expect(wrapper.text()).toContain('REGISTROS')
    expect(wrapper.text()).toContain('312')
    expect(wrapper.text()).toContain('NOTA')
    expect(wrapper.text()).toContain('4,4')
    expect(wrapper.text()).toContain('PREÇO MÉDIO')
    expect(wrapper.text()).toContain('4,9k')
  })

  it('mostra o preço abaixo de mil sem abreviar', () => {
    const wrapper = mount(FichaMetricas, {
      props: {
        estatisticas: { totalRegistros: 8, notaMedia: 4, precoMedio: 850 }
      }
    })

    expect(wrapper.text()).toContain('850')
  })

  it('mostra travessão quando não há nota ou preço', () => {
    const wrapper = mount(FichaMetricas, {
      props: {
        estatisticas: { totalRegistros: 0, notaMedia: null, precoMedio: null }
      }
    })

    expect(wrapper.text()).toContain('—')
  })
})
