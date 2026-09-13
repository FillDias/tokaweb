import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ListaModificacoes from './ListaModificacoes.vue'

describe('ListaModificacoes', () => {
  it('agrupa as modificações por sistema (categoria) e linka pra ficha certa', () => {
    const wrapper = mount(ListaModificacoes, {
      props: {
        sistemas: [
          {
            categoria: 'suspensao',
            itens: [
              {
                id: '1',
                data: '2024-02-10',
                km: 96100,
                peca: { fabricante: 'TEIN', nome: 'Flex Z', codigo: 'VSTB8-C1SS3', categoria: 'suspensao' }
              }
            ]
          },
          {
            categoria: 'motor',
            itens: [
              {
                id: '2',
                data: '2023-06-01',
                km: 500,
                peca: { fabricante: 'HKS', nome: 'Turbo GT', codigo: 'ABC123', categoria: 'motor' }
              }
            ]
          }
        ]
      }
    })

    expect(wrapper.text()).toContain('suspensao')
    expect(wrapper.text()).toContain('motor')
    expect(wrapper.text()).toContain('Flex Z')
    expect(wrapper.text()).toContain('Turbo GT')
    expect(wrapper.text()).toContain('02/2024')
    expect(wrapper.text()).toContain('96.100 km')

    const links = wrapper.findAll('a')
    expect(links[0].attributes('href')).toBe('/peca/tein-flex-z-vstb8c1ss3')
    expect(links[1].attributes('href')).toBe('/peca/hks-turbo-gt-abc123')
  })
})
