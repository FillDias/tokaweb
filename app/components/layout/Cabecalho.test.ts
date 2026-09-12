import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Cabecalho from './Cabecalho.vue'

describe('Cabecalho', () => {
  it('mostra a logo TOKA', () => {
    const wrapper = mount(Cabecalho)

    expect(wrapper.text()).toContain('TOKA')
  })

  it('mostra a busca com o placeholder certo e botão Buscar, sem submeter de verdade', () => {
    const wrapper = mount(Cabecalho)
    const input = wrapper.find('input')

    expect(input.attributes('placeholder')).toBe('Código da peça, nome ou fabricante — ex.: VSTB8-C1SS3')
    expect(wrapper.text()).toContain('Buscar')
  })

  it('mostra os links utilitários Garagem, Oficinas e Entrar', () => {
    const wrapper = mount(Cabecalho)

    expect(wrapper.text()).toContain('Garagem')
    expect(wrapper.text()).toContain('Oficinas')
    expect(wrapper.text()).toContain('Entrar')
  })

  it('mostra os 6 itens de navegação bilíngues', () => {
    const wrapper = mount(Cabecalho)
    const itens = [
      ['Peças', 'パーツ'],
      ['Minha garagem', '愛車'],
      ['Livro de manutenção', '整備手帳'],
      ['Feira', '市場'],
      ['Oficinas', '工場'],
      ['Guias', 'ガイド']
    ]

    for (const [pt, jp] of itens) {
      expect(wrapper.text()).toContain(pt)
      expect(wrapper.text()).toContain(jp)
    }
  })

  it('a busca vai para a própria linha abaixo do breakpoint sm', () => {
    const wrapper = mount(Cabecalho)
    const busca = wrapper.find('[data-testid="cabecalho-busca"]')

    expect(busca.classes()).toContain('order-3')
    expect(busca.classes()).toContain('w-full')
  })
})
