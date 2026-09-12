import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SeloCompat from './SeloCompat.vue'

describe('SeloCompat', () => {
  it.each([
    ['direto', 'Encaixe direto', 'text-seiji'],
    ['adaptacao', 'Precisa de adaptação', 'text-ki-txt'],
    ['nao_serve', 'Não serve', 'text-shu'],
    ['sem_dados', 'Sem dados', 'text-mute']
  ] as const)('estado=%s renderiza "%s" com a classe %s', (estado, rotulo, classe) => {
    const wrapper = mount(SeloCompat, { props: { estado } })

    expect(wrapper.text()).toBe(rotulo)
    expect(wrapper.classes()).toContain(classe)
  })

  it('texto customizado substitui o rótulo padrão do estado', () => {
    const wrapper = mount(SeloCompat, {
      props: { estado: 'nao_serve', texto: 'Bate na pinça de 4 pistões' }
    })

    expect(wrapper.text()).toBe('Bate na pinça de 4 pistões')
  })
})
