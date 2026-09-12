import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Rodape from './Rodape.vue'

describe('Rodape', () => {
  it('mostra as três colunas de navegação e a marca', () => {
    const wrapper = mount(Rodape)

    expect(wrapper.text()).toContain('TOKA')
    expect(wrapper.text()).toContain('PEÇAS')
    expect(wrapper.text()).toContain('GARAGEM')
    expect(wrapper.text()).toContain('COMUNIDADE')
  })

  it('a grade colapsa por breakpoint: 1 coluna no mobile, 4 no desktop', () => {
    const wrapper = mount(Rodape)
    const grade = wrapper.find('[data-testid="rodape-grade"]')

    expect(grade.classes()).toContain('grid-cols-1')
    expect(grade.classes()).toContain('sm:grid-cols-2')
    expect(grade.classes()).toContain('lg:grid-cols-4')
  })
})
