import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SeloCompletude from './SeloCompletude.vue'

describe('SeloCompletude', () => {
  it('mostra perfil completo quando motor, km e dono estão preenchidos', () => {
    const wrapper = mount(SeloCompletude, {
      props: { veiculo: { motor: 'SR20DET', kmAtual: 96100, dono: 'kenji.garage' } }
    })

    expect(wrapper.text()).toBe('Perfil completo')
  })

  it('lista os campos que faltam preencher', () => {
    const wrapper = mount(SeloCompletude, {
      props: { veiculo: { motor: null, kmAtual: 96100, dono: null } }
    })

    expect(wrapper.text()).toBe('Falta preencher: motor, dono')
  })

  it('lista todos quando o veículo não tem nenhum campo opcional preenchido', () => {
    const wrapper = mount(SeloCompletude, {
      props: { veiculo: { motor: null, kmAtual: null, dono: null } }
    })

    expect(wrapper.text()).toBe('Falta preencher: motor, km atual, dono')
  })
})
