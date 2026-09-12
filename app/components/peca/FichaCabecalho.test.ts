import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FichaCabecalho from './FichaCabecalho.vue'

const peca = {
  fabricante: 'TEIN',
  nome: 'Flex Z',
  codigo: 'VSTB8-C1SS3',
  categoria: 'Suspensão a rosca'
}

describe('FichaCabecalho', () => {
  it('mostra fabricante e categoria na mesma linha, separados por ponto médio', () => {
    const wrapper = mount(FichaCabecalho, { props: { peca } })

    expect(wrapper.text()).toContain('TEIN · Suspensão a rosca')
  })

  it('mostra o nome da peça como título principal (h1)', () => {
    const wrapper = mount(FichaCabecalho, { props: { peca } })

    expect(wrapper.find('h1').text()).toBe('Flex Z')
  })

  it('mostra o código no bloco grande', () => {
    const wrapper = mount(FichaCabecalho, { props: { peca } })

    expect(wrapper.text()).toContain('CÓDIGO DA PEÇA')
    expect(wrapper.text()).toContain('VSTB8-C1SS3')
  })
})
