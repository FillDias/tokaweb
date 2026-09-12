import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FichaVazia from './FichaVazia.vue'

describe('FichaVazia', () => {
  it('avisa que não há instalação registrada, sem prometer o que ainda não existe', () => {
    const wrapper = mount(FichaVazia)

    expect(wrapper.text()).toContain('Nenhuma instalação registrada ainda')
  })
})
