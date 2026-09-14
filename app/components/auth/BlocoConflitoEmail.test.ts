import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BlocoConflitoEmail from './BlocoConflitoEmail.vue'

describe('BlocoConflitoEmail', () => {
  it('mostra o provedor certo e um botão pra entrar por ele', () => {
    const wrapper = mount(BlocoConflitoEmail, {
      props: { provedor: 'google', email: 'fulano@example.com' }
    })

    expect(wrapper.text()).toContain('Essa conta entra pelo Google')
    expect(wrapper.text()).toContain('fulano@example.com')
    expect(wrapper.find('a[href="/api/auth/google"]').exists()).toBe(true)
  })

  it('não mostra botão de provedor quando o conflito é com email e senha', () => {
    const wrapper = mount(BlocoConflitoEmail, {
      props: { provedor: 'email', email: 'fulano@example.com' }
    })

    expect(wrapper.text()).toContain('Essa conta entra com Email e senha')
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('funciona sem email pra mostrar (Line sem escopo aprovado)', () => {
    const wrapper = mount(BlocoConflitoEmail, {
      props: { provedor: 'line', email: null }
    })

    expect(wrapper.text()).toContain('Essa conta entra pelo Line')
    expect(wrapper.text()).not.toContain('null')
  })
})
