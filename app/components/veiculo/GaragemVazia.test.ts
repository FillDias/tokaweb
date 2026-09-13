import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import GaragemVazia from './GaragemVazia.vue'

describe('GaragemVazia', () => {
  it('avisa que não há modificação registrada', () => {
    const wrapper = mount(GaragemVazia)

    expect(wrapper.text()).toContain('Nenhuma modificação registrada ainda')
  })
})
