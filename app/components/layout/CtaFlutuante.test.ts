import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CtaFlutuante from './CtaFlutuante.vue'

describe('CtaFlutuante', () => {
  it('mostra os botões Registrar peça (primário) e Não achei minha peça (ghost)', () => {
    const wrapper = mount(CtaFlutuante)

    expect(wrapper.text()).toContain('Registrar peça')
    expect(wrapper.text()).toContain('Não achei minha peça')
  })

  it('o botão secundário some abaixo do breakpoint sm (mobile)', () => {
    const wrapper = mount(CtaFlutuante)
    const secundario = wrapper.findAll('a, button').find((el) => el.text() === 'Não achei minha peça')

    expect(secundario!.classes()).toContain('hidden')
    expect(secundario!.classes()).toContain('sm:inline-flex')
  })
})
