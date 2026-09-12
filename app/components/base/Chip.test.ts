import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Chip from './Chip.vue'

describe('Chip', () => {
  it.each([
    ['novo', 'NOVO', 'bg-seiji'],
    ['nos', 'NOS', 'bg-ki'],
    ['usado', 'USADO', 'bg-sumi'],
    ['retirada', 'RETIRADA', 'bg-sumi'],
    ['sucata', 'SUCATA', 'bg-shu']
  ] as const)(
    'condicao=%s renderiza rótulo %s com a classe %s',
    (condicao, rotulo, classe) => {
      const wrapper = mount(Chip, { props: { condicao } })

      expect(wrapper.text()).toBe(rotulo)
      expect(wrapper.classes()).toContain(classe)
    }
  )
})
