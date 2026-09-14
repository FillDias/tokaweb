import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Botao from './Botao.vue'

describe('Botao', () => {
  it('renderiza como <button> por padrão, com o texto do slot', () => {
    const wrapper = mount(Botao, {
      slots: { default: 'Buscar' }
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.text()).toBe('Buscar')
  })

  it('renderiza como <a> quando recebe href', () => {
    const wrapper = mount(Botao, {
      props: { href: '/garagem/123' },
      slots: { default: 'Ver garagem' }
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/garagem/123')
  })

  it('variante primário (padrão) usa fundo mostarda', () => {
    const wrapper = mount(Botao, { slots: { default: 'Buscar' } })

    expect(wrapper.classes()).toContain('bg-ki')
  })

  it('variante ghost usa fundo papel, sem sombra', () => {
    const wrapper = mount(Botao, {
      props: { variante: 'ghost' },
      slots: { default: 'Cancelar' }
    })

    expect(wrapper.classes()).toContain('bg-paper')
    expect(wrapper.classes()).not.toContain('bg-ki')
  })

  it('pill deixa os cantos totalmente arredondados', () => {
    const wrapper = mount(Botao, {
      props: { pill: true },
      slots: { default: 'trocar veículo' }
    })

    expect(wrapper.classes()).toContain('rounded-full')
  })

  it('sem pill usa o raio padrão do produto', () => {
    const wrapper = mount(Botao, { slots: { default: 'Buscar' } })

    expect(wrapper.classes()).not.toContain('rounded-full')
  })

  it('chapado remove a sombra deslocada do variante primário', () => {
    const wrapper = mount(Botao, {
      props: { chapado: true },
      slots: { default: 'Entrar' }
    })

    expect(wrapper.classes()).toContain('bg-ki')
    expect(wrapper.classes().some((classe) => classe.startsWith('shadow-'))).toBe(false)
  })

  it('disabled bloqueia o clique', async () => {
    const aoClicar = vi.fn()
    const wrapper = mount(Botao, {
      props: { disabled: true },
      attrs: { onClick: aoClicar },
      slots: { default: 'Buscar' }
    })

    await wrapper.trigger('click')

    expect(aoClicar).not.toHaveBeenCalled()
  })
})
