import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ListaInstalacoes from './ListaInstalacoes.vue'

describe('ListaInstalacoes', () => {
  it('mostra veículo, data, km, oficina, custo e nota de cada instalação', () => {
    const wrapper = mount(ListaInstalacoes, {
      props: {
        instalacoes: [
          {
            id: '1',
            data: '2024-02-10',
            km: 96100,
            custo: '5100.00',
            oficina: 'feito em casa',
            nota: 5,
            oQueDeuErrado: 'Zero folga depois de 22 mil km.',
            fotos: [],
            veiculo: { marca: 'Nissan', modelo: '180SX', ano: 1994, motor: 'SR20DET', dono: 'kenji.garage' }
          }
        ]
      }
    })

    expect(wrapper.text()).toContain('Nissan 180SX · 1994 · SR20DET')
    expect(wrapper.text()).toContain('@kenji.garage')
    expect(wrapper.text()).toContain('02/2024')
    expect(wrapper.text()).toContain('96.100 km')
    expect(wrapper.text()).toContain('feito em casa')
    expect(wrapper.text()).toContain('R$')
    expect(wrapper.text()).toContain('★★★★★')
    expect(wrapper.text()).toContain('Zero folga depois de 22 mil km.')
  })

  it('mostra estado vazio quando não há nenhuma instalação', () => {
    const wrapper = mount(ListaInstalacoes, { props: { instalacoes: [] } })

    expect(wrapper.text()).toContain('Nenhuma instalação registrada ainda.')
  })

  it('não quebra quando campos opcionais estão ausentes', () => {
    const wrapper = mount(ListaInstalacoes, {
      props: {
        instalacoes: [
          {
            id: '2',
            data: '2023-05-01',
            km: null,
            custo: null,
            oficina: null,
            nota: null,
            oQueDeuErrado: null,
            fotos: [],
            veiculo: { marca: 'Toyota', modelo: 'Corolla', ano: 2010, motor: null, dono: null }
          }
        ]
      }
    })

    expect(wrapper.text()).toContain('Toyota Corolla · 2010')
    expect(wrapper.text()).toContain('05/2023')
  })

  it('mostra as fotos da instalação quando existem', () => {
    const wrapper = mount(ListaInstalacoes, {
      props: {
        instalacoes: [
          {
            id: '3',
            data: '2024-03-01',
            km: null,
            custo: null,
            oficina: null,
            nota: null,
            oQueDeuErrado: null,
            fotos: ['https://minio.exemplo/a.jpg', 'https://minio.exemplo/b.jpg'],
            veiculo: { marca: 'Honda', modelo: 'Civic', ano: 2018, motor: null, dono: null }
          }
        ]
      }
    })

    const imagens = wrapper.findAll('img')
    expect(imagens).toHaveLength(2)
    expect(imagens[0].attributes('src')).toBe('https://minio.exemplo/a.jpg')
  })

  it('não mostra nenhuma imagem quando não há fotos', () => {
    const wrapper = mount(ListaInstalacoes, {
      props: {
        instalacoes: [
          {
            id: '4',
            data: '2024-03-01',
            km: null,
            custo: null,
            oficina: null,
            nota: null,
            oQueDeuErrado: null,
            fotos: [],
            veiculo: { marca: 'Honda', modelo: 'Civic', ano: 2018, motor: null, dono: null }
          }
        ]
      }
    })

    expect(wrapper.findAll('img')).toHaveLength(0)
  })
})
