import { describe, expect, it } from 'vitest'
import { defineComponent, h, Suspense } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { getQuery } from 'h3'
import SeletorCascata from './SeletorCascata.vue'

registerEndpoint('/api/veiculos/opcoes', (event) => {
  const query = getQuery(event)

  if (query.ano) return { marcas: [], modelos: [], anos: [], motores: ['SR20DET', 'CA18DET'] }
  if (query.modelo) return { marcas: [], modelos: [], anos: [1994, 1996], motores: [] }
  if (query.marca) return { marcas: [], modelos: ['180SX', 'Silvia S13'], anos: [], motores: [] }
  return { marcas: ['Nissan', 'Toyota'], modelos: [], anos: [], motores: [] }
})

describe('SeletorCascata', () => {
  it('carrega as marcas ao montar', async () => {
    const wrapper = await mountAsync()

    const options = wrapper.findAll('select')[0].findAll('option')
    expect(options.map((o) => o.text())).toContain('Nissan')
  })

  it('carrega modelos ao escolher marca, e reseta os campos seguintes', async () => {
    const wrapper = await mountAsync()

    const [selectMarca, selectModelo, selectAno] = wrapper.findAll('select')
    await selectMarca.setValue('Nissan')
    await esperarFetch()

    expect(selectModelo.attributes('disabled')).toBeUndefined()
    expect(selectModelo.findAll('option').map((o) => o.text())).toContain('180SX')
    expect(selectAno.attributes('disabled')).toBeDefined()
  })

  it('emite confirmar só quando os quatro níveis estão escolhidos', async () => {
    const wrapper = await mountAsync()

    const [selectMarca, selectModelo, selectAno, selectMotor] = wrapper.findAll('select')
    await selectMarca.setValue('Nissan')
    await esperarFetch()
    await selectModelo.setValue('180SX')
    await esperarFetch()
    await selectAno.setValue('1994')
    await esperarFetch()
    await selectMotor.setValue('SR20DET')
    await flushPromises()

    await wrapper.find('button').trigger('click')

    expect(wrapper.findComponent(SeletorCascata).emitted('confirmar')).toEqual([
      [{ marca: 'Nissan', modelo: '180SX', ano: 1994, motor: 'SR20DET' }]
    ])
  })
})

async function esperarFetch() {
  await flushPromises()
  await new Promise((resolve) => setTimeout(resolve, 0))
  await flushPromises()
}

async function mountAsync() {
  const raiz = defineComponent({
    setup() {
      return () => h(Suspense, () => h(SeletorCascata))
    }
  })
  const wrapper = mount(raiz)
  await esperarFetch()
  return wrapper
}
