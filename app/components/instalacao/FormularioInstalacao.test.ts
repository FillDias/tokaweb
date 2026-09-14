import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FormularioInstalacao from './FormularioInstalacao.vue'

const PECA_ID = '11111111-1111-4111-8111-111111111111'

function preencherVeiculo(wrapper: ReturnType<typeof mount>) {
  wrapper.find('input[name="marca"]').setValue('Honda')
  wrapper.find('input[name="modelo"]').setValue('Civic')
  wrapper.find('input[name="ano"]').setValue('2018')
  wrapper.find('input[name="motor"]').setValue('2.0 16V')
  wrapper.find('input[name="data"]').setValue('2024-01-10')
}

describe('FormularioInstalacao', () => {
  it('manda o pecaId como campo oculto', () => {
    const wrapper = mount(FormularioInstalacao, { props: { pecaId: PECA_ID } })

    expect(wrapper.find('input[name="pecaId"]').attributes('value')).toBe(PECA_ID)
  })

  it('bloqueia o envio e mostra erro quando falta veículo', async () => {
    const wrapper = mount(FormularioInstalacao, { props: { pecaId: PECA_ID } })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('obrigat')
  })

  it('bloqueia o envio quando o ano está fora do razoável', async () => {
    const wrapper = mount(FormularioInstalacao, { props: { pecaId: PECA_ID } })
    await preencherVeiculo(wrapper)
    await wrapper.find('input[name="ano"]').setValue('1800')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Ano inválido')
  })

  it('não mostra erro quando os obrigatórios estão preenchidos corretamente', async () => {
    const wrapper = mount(FormularioInstalacao, { props: { pecaId: PECA_ID } })
    await preencherVeiculo(wrapper)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).not.toContain('obrigat')
    expect(wrapper.text()).not.toContain('inválid')
  })

  it('compatibilidade não oferece a opção sem_dados — é estado derivado, não escolhido', () => {
    const wrapper = mount(FormularioInstalacao, { props: { pecaId: PECA_ID } })

    const valores = wrapper.findAll('select[name="compatibilidade"] option').map((o) => o.attributes('value'))
    expect(valores).toEqual(['', 'direto', 'adaptacao', 'nao_serve'])
  })
})
