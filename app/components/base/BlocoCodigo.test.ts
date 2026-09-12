import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BlocoCodigo from './BlocoCodigo.vue'

describe('BlocoCodigo', () => {
  it('tamanho pequeno (padrão) mostra só o código, sem rótulo', () => {
    const wrapper = mount(BlocoCodigo, { props: { codigo: 'VSTB8-C1SS3' } })

    expect(wrapper.text()).toBe('VSTB8-C1SS3')
  })

  it('tamanho grande mostra o rótulo "CÓDIGO DA PEÇA" acima do código', () => {
    const wrapper = mount(BlocoCodigo, {
      props: { codigo: 'VSTB8-C1SS3', tamanho: 'grande' }
    })

    expect(wrapper.text()).toContain('CÓDIGO DA PEÇA')
    expect(wrapper.text()).toContain('VSTB8-C1SS3')
    expect(wrapper.classes()).toContain('bg-ai')
  })
})
