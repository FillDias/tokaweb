import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CabecalhoGaragem from './CabecalhoGaragem.vue'

describe('CabecalhoGaragem', () => {
  it('mostra marca, modelo, ano, motor e km', () => {
    const wrapper = mount(CabecalhoGaragem, {
      props: {
        veiculo: { marca: 'Nissan', modelo: '180SX', ano: 1994, motor: 'SR20DET', kmAtual: 96100, dono: 'kenji.garage' }
      }
    })

    expect(wrapper.find('h1').text()).toBe('Nissan 180SX')
    expect(wrapper.text()).toContain('1994')
    expect(wrapper.text()).toContain('SR20DET')
    expect(wrapper.text()).toContain('96.100 km')
    expect(wrapper.text()).toContain('@kenji.garage')
  })

  it('não quebra quando motor, km e dono estão ausentes', () => {
    const wrapper = mount(CabecalhoGaragem, {
      props: {
        veiculo: { marca: 'Toyota', modelo: 'Corolla', ano: 2010, motor: null, kmAtual: null, dono: null }
      }
    })

    expect(wrapper.find('h1').text()).toBe('Toyota Corolla')
    expect(wrapper.text()).toContain('2010')
  })
})
