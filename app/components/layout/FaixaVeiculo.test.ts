import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FaixaVeiculo from './FaixaVeiculo.vue'

describe('FaixaVeiculo', () => {
  it('sem veículo, mostra estado vazio', () => {
    const wrapper = mount(FaixaVeiculo)

    expect(wrapper.text()).toContain('Nenhum veículo selecionado')
    expect(wrapper.text()).toContain('Selecionar veículo')
  })

  it('com veículo, mostra nome, detalhes e ação de trocar', () => {
    const wrapper = mount(FaixaVeiculo, {
      props: {
        veiculo: {
          marca: 'Nissan',
          modelo: 'Silvia S13',
          ano: 1991,
          motor: 'SR20DET',
          km: 187430
        }
      }
    })

    expect(wrapper.text()).toContain('Nissan Silvia S13')
    expect(wrapper.text()).toContain('1991')
    expect(wrapper.text()).toContain('SR20DET')
    expect(wrapper.text()).toContain('187.430 km')
    expect(wrapper.text()).toContain('trocar veículo')
  })

  it('sem km (veículo veio da busca por aplicação, não da garagem), não mostra "undefined km"', () => {
    const wrapper = mount(FaixaVeiculo, {
      props: {
        veiculo: { marca: 'Nissan', modelo: '180SX', ano: 1994, motor: 'SR20DET' }
      }
    })

    expect(wrapper.text()).toContain('Nissan 180SX')
    expect(wrapper.text()).not.toContain('km')
  })
})
