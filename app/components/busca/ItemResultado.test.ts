import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemResultado from './ItemResultado.vue'

const resultado = { fabricante: 'TEIN', nome: 'Flex Z', codigo: 'VSTB8-C1SS3' }

describe('ItemResultado', () => {
  it('mostra fabricante, nome e código, linkando pra ficha certa', () => {
    const wrapper = mount(ItemResultado, { props: { resultado } })

    expect(wrapper.text()).toContain('TEIN')
    expect(wrapper.text()).toContain('Flex Z')
    expect(wrapper.text()).toContain('VSTB8-C1SS3')
    expect(wrapper.find('a').attributes('href')).toBe('/peca/tein-flex-z-vstb8c1ss3')
  })

  it('sem compatibilidade informada, não mostra selo', () => {
    const wrapper = mount(ItemResultado, { props: { resultado } })

    expect(wrapper.findComponent({ name: 'SeloCompat' }).exists()).toBe(false)
  })

  it('com compatibilidade informada, mostra o selo certo', () => {
    const wrapper = mount(ItemResultado, { props: { resultado, compatibilidade: 'direto' } })

    expect(wrapper.text()).toContain('Encaixe direto')
  })
})
