import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { eq, inArray } from 'drizzle-orm'
import { db, veiculo, peca, instalacao, foto, usuario, curtida } from '~~/server/database'
import {
  buscarCompatibilidadeEmLote,
  buscarEstatisticasPeca,
  buscarInstalacoesPeca,
  buscarInstalacoesRecentes,
  buscarModificacoesPorVeiculo,
  buscarRelatosDefeito,
  criarInstalacao
} from './instalacao'
import { criarFotos } from './foto'
import { curtir } from './curtida'

function meseAtras(n: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  return d.toISOString().slice(0, 10)
}

describe('buscarEstatisticasPeca', () => {
  let veiculoId: string
  const codigoComDados = 'TOKA-TESTE-STATS-A1'
  const codigoSemRegistro = 'TOKA-TESTE-STATS-A2'
  let pecaComDadosId: string
  let pecaSemRegistroId: string

  beforeAll(async () => {
    const [v] = await db
      .insert(veiculo)
      .values({ marca: 'TOKA QA', modelo: 'Veículo de teste', ano: 2000 })
      .returning({ id: veiculo.id })
    veiculoId = v.id

    const [p1] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça com dados', codigo: codigoComDados, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaComDadosId = p1.id

    const [p2] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça sem registro', codigo: codigoSemRegistro, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaSemRegistroId = p2.id

    await db.insert(instalacao).values([
      { veiculoId, pecaId: pecaComDadosId, data: '2024-01-10', nota: 5, custo: '100.00' },
      { veiculoId, pecaId: pecaComDadosId, data: '2024-02-10', nota: 4, custo: '200.00' },
      { veiculoId, pecaId: pecaComDadosId, data: '2024-03-10', nota: 3, custo: '300.00' }
    ])
  })

  afterAll(async () => {
    await db.delete(instalacao).where(eq(instalacao.veiculoId, veiculoId))
    await db.delete(peca).where(eq(peca.codigo, codigoComDados))
    await db.delete(peca).where(eq(peca.codigo, codigoSemRegistro))
    await db.delete(veiculo).where(eq(veiculo.id, veiculoId))
  })

  it('calcula total de registros, nota média e preço médio', async () => {
    const resultado = await buscarEstatisticasPeca(pecaComDadosId)

    expect(resultado).toEqual({
      totalRegistros: 3,
      notaMedia: 4,
      precoMedio: 200
    })
  })

  it('retorna médias nulas quando a peça não tem nenhum registro', async () => {
    const resultado = await buscarEstatisticasPeca(pecaSemRegistroId)

    expect(resultado).toEqual({
      totalRegistros: 0,
      notaMedia: null,
      precoMedio: null
    })
  })
})

describe('buscarRelatosDefeito', () => {
  let veiculoId: string
  const codigoCru = 'TOKA-TESTE-DEFEITO-B1'
  const codigoEstatistica = 'TOKA-TESTE-DEFEITO-B2'
  let pecaCruId: string
  let pecaEstatisticaId: string

  beforeAll(async () => {
    const [v] = await db
      .insert(veiculo)
      .values({ marca: 'TOKA QA', modelo: 'Veículo de teste', ano: 2000 })
      .returning({ id: veiculo.id })
    veiculoId = v.id

    const [p1] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça poucos relatos', codigo: codigoCru, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaCruId = p1.id

    const [p2] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça com estatística', codigo: codigoEstatistica, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaEstatisticaId = p2.id

    // só 2 elegíveis (>6 meses) — abaixo do mínimo de 5
    await db.insert(instalacao).values([
      { veiculoId, pecaId: pecaCruId, data: meseAtras(8), oQueDeuErrado: 'Rangeu um pouco depois de uns meses' },
      { veiculoId, pecaId: pecaCruId, data: meseAtras(9), oQueDeuErrado: 'Vazou um pouco de óleo' }
    ])

    // 5 elegíveis (>6 meses) + 1 recente (não conta)
    await db.insert(instalacao).values([
      { veiculoId, pecaId: pecaEstatisticaId, data: meseAtras(12), oQueDeuErrado: 'Rangeu depois de uso' },
      { veiculoId, pecaId: pecaEstatisticaId, data: meseAtras(11), oQueDeuErrado: 'Rangeu depois de uso' },
      { veiculoId, pecaId: pecaEstatisticaId, data: meseAtras(10), oQueDeuErrado: 'Vazamento' },
      { veiculoId, pecaId: pecaEstatisticaId, data: meseAtras(9), oQueDeuErrado: 'Vazamento' },
      { veiculoId, pecaId: pecaEstatisticaId, data: meseAtras(7), oQueDeuErrado: null },
      { veiculoId, pecaId: pecaEstatisticaId, data: meseAtras(1), oQueDeuErrado: 'Não deveria contar, é recente' }
    ])
  })

  afterAll(async () => {
    await db.delete(instalacao).where(eq(instalacao.veiculoId, veiculoId))
    await db.delete(peca).where(eq(peca.codigo, codigoCru))
    await db.delete(peca).where(eq(peca.codigo, codigoEstatistica))
    await db.delete(veiculo).where(eq(veiculo.id, veiculoId))
  })

  it('mostra os textos crus quando tem menos de 5 registros maduros (>6 meses)', async () => {
    const resultado = await buscarRelatosDefeito(pecaCruId)

    expect(resultado.modo).toBe('cru')
    if (resultado.modo === 'cru') {
      expect(resultado.textos.sort()).toEqual([
        'Rangeu um pouco depois de uns meses',
        'Vazou um pouco de óleo'
      ].sort())
    }
  })

  it('calcula percentual só sobre registros com mais de 6 meses, ignorando o recente', async () => {
    const resultado = await buscarRelatosDefeito(pecaEstatisticaId)

    expect(resultado.modo).toBe('estatistica')
    if (resultado.modo === 'estatistica') {
      const ordenado = [...resultado.relatos].sort((a, b) => a.texto.localeCompare(b.texto))
      expect(ordenado).toEqual([
        { texto: 'Rangeu depois de uso', percentual: 40 },
        { texto: 'Vazamento', percentual: 40 }
      ])
    }
  })
})

describe('buscarInstalacoesPeca', () => {
  let veiculoId: string
  const codigoTeste = 'TOKA-TESTE-LISTA-C1'
  let pecaId: string

  beforeAll(async () => {
    const [v] = await db
      .insert(veiculo)
      .values({ marca: 'Nissan', modelo: '180SX', ano: 1994, motor: 'SR20DET', dono: 'kenji.garage' })
      .returning({ id: veiculo.id })
    veiculoId = v.id

    const [p] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça com instalações', codigo: codigoTeste, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaId = p.id

    await db.insert(instalacao).values([
      { veiculoId, pecaId, data: '2024-02-10', km: 96100, custo: '5100.00', oficina: 'feito em casa', nota: 5 },
      { veiculoId, pecaId, data: '2023-08-05', km: 158900, custo: '4890.00', oficina: 'Oficina Tanaka', nota: 4 }
    ])
  })

  afterAll(async () => {
    const idsInstalacao = (await db.select({ id: instalacao.id }).from(instalacao).where(eq(instalacao.pecaId, pecaId))).map(
      (l) => l.id
    )
    if (idsInstalacao.length > 0) {
      await db.delete(curtida).where(inArray(curtida.instalacaoId, idsInstalacao))
      await db.delete(foto).where(inArray(foto.instalacaoId, idsInstalacao))
    }
    await db.delete(instalacao).where(eq(instalacao.pecaId, pecaId))
    await db.delete(peca).where(eq(peca.codigo, codigoTeste))
    await db.delete(veiculo).where(eq(veiculo.id, veiculoId))
  })

  it('a instalação mais curtida sobe pra frente mesmo sendo mais antiga', async () => {
    const [antes] = await buscarInstalacoesPeca(pecaId)
    expect(antes.data).toBe('2024-02-10') // mais recente, sem curtida ainda

    const [u] = await db.insert(usuario).values({ nome: 'Curtidor de Teste' }).returning({ id: usuario.id })
    const [maisAntiga] = await db
      .select({ id: instalacao.id })
      .from(instalacao)
      .where(eq(instalacao.data, '2023-08-05'))
    await curtir(u.id, maisAntiga.id)

    const [depois] = await buscarInstalacoesPeca(pecaId)
    expect(depois.data).toBe('2023-08-05')
    expect(depois.curtidas).toBe(1)

    await db.delete(curtida).where(eq(curtida.usuarioId, u.id))
    await db.delete(usuario).where(eq(usuario.id, u.id))
  })

  it('lista as instalações da peça, mais recente primeiro, com o veículo junto', async () => {
    const resultado = await buscarInstalacoesPeca(pecaId)

    expect(resultado).toHaveLength(2)
    expect(resultado[0]).toMatchObject({
      data: '2024-02-10',
      km: 96100,
      oficina: 'feito em casa',
      nota: 5,
      veiculo: { marca: 'Nissan', modelo: '180SX', ano: 1994, motor: 'SR20DET', dono: 'kenji.garage' }
    })
    expect(resultado[1]).toMatchObject({ data: '2023-08-05', oficina: 'Oficina Tanaka' })
    expect(resultado[0].fotos).toEqual([])
  })

  it('devolve as urls assinadas das fotos da instalação', async () => {
    const resultado = await buscarInstalacoesPeca(pecaId)
    const idInstalacaoRecente = resultado[0].id

    await criarFotos(idInstalacaoRecente, ['instalacao/teste-1.jpg', 'instalacao/teste-2.jpg'])

    const comFotos = await buscarInstalacoesPeca(pecaId)
    const instalacaoComFotos = comFotos.find((i) => i.id === idInstalacaoRecente)!

    expect(instalacaoComFotos.fotos).toHaveLength(2)
    for (const url of instalacaoComFotos.fotos) {
      expect(decodeURIComponent(url)).toContain('teste-')
    }
  })

  it('retorna lista vazia quando a peça não tem nenhuma instalação', async () => {
    const [semRegistro] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça sem instalação', codigo: 'TOKA-TESTE-LISTA-C2', categoria: 'teste' })
      .returning({ id: peca.id })

    const resultado = await buscarInstalacoesPeca(semRegistro.id)

    expect(resultado).toEqual([])

    await db.delete(peca).where(eq(peca.id, semRegistro.id))
  })
})

describe('buscarCompatibilidadeEmLote', () => {
  const veiculoAlvo = { marca: 'TOKA QA Nissan', modelo: 'Silvia S13', motor: 'SR20DET' }
  let veiculoAlvoId: string
  let veiculoOutroMotorId: string
  const codigoDireto = 'TOKA-TESTE-COMPAT-D1'
  const codigoNaoServe = 'TOKA-TESTE-COMPAT-D2'
  const codigoSemDados = 'TOKA-TESTE-COMPAT-D3'
  let pecaDiretoId: string
  let pecaNaoServeId: string
  let pecaSemDadosId: string

  beforeAll(async () => {
    const [v1] = await db
      .insert(veiculo)
      .values({ marca: veiculoAlvo.marca, modelo: veiculoAlvo.modelo, ano: 1991, motor: veiculoAlvo.motor })
      .returning({ id: veiculo.id })
    veiculoAlvoId = v1.id

    const [v2] = await db
      .insert(veiculo)
      .values({ marca: veiculoAlvo.marca, modelo: veiculoAlvo.modelo, ano: 1991, motor: 'CA18DET' })
      .returning({ id: veiculo.id })
    veiculoOutroMotorId = v2.id

    const [p1] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça direto', codigo: codigoDireto, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaDiretoId = p1.id

    const [p2] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça não serve', codigo: codigoNaoServe, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaNaoServeId = p2.id

    const [p3] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça sem dados', codigo: codigoSemDados, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaSemDadosId = p3.id

    await db.insert(instalacao).values([
      { veiculoId: veiculoAlvoId, pecaId: pecaDiretoId, data: '2024-01-10', compatibilidade: 'direto' },
      { veiculoId: veiculoAlvoId, pecaId: pecaNaoServeId, data: '2024-01-10', compatibilidade: 'direto' },
      { veiculoId: veiculoAlvoId, pecaId: pecaNaoServeId, data: '2024-02-10', compatibilidade: 'nao_serve' },
      // esse registro é de outro motor — não deve contar pra pecaSemDados no veículo alvo
      { veiculoId: veiculoOutroMotorId, pecaId: pecaSemDadosId, data: '2024-01-10', compatibilidade: 'direto' }
    ])
  })

  afterAll(async () => {
    await db.delete(instalacao).where(inArray(instalacao.veiculoId, [veiculoAlvoId, veiculoOutroMotorId]))
    await db.delete(peca).where(inArray(peca.id, [pecaDiretoId, pecaNaoServeId, pecaSemDadosId]))
    await db.delete(veiculo).where(inArray(veiculo.id, [veiculoAlvoId, veiculoOutroMotorId]))
  })

  it('marca direto quando só há relato de encaixe direto', async () => {
    const resultado = await buscarCompatibilidadeEmLote([pecaDiretoId], veiculoAlvo)

    expect(resultado[pecaDiretoId]).toBe('direto')
  })

  it('prioriza não_serve mesmo havendo relato de direto pro mesmo veículo', async () => {
    const resultado = await buscarCompatibilidadeEmLote([pecaNaoServeId], veiculoAlvo)

    expect(resultado[pecaNaoServeId]).toBe('nao_serve')
  })

  it('marca sem_dados quando o relato existente é de outro motor', async () => {
    const resultado = await buscarCompatibilidadeEmLote([pecaSemDadosId], veiculoAlvo)

    expect(resultado[pecaSemDadosId]).toBe('sem_dados')
  })

  it('retorna objeto vazio quando a lista de peças é vazia', async () => {
    const resultado = await buscarCompatibilidadeEmLote([], veiculoAlvo)

    expect(resultado).toEqual({})
  })
})

describe('buscarModificacoesPorVeiculo', () => {
  let veiculoId: string
  const codigoSuspensao = 'TOKA-TESTE-MOD-SUSP'
  const codigoMotor = 'TOKA-TESTE-MOD-MOTOR'
  let pecaSuspensaoId: string
  let pecaMotorId: string

  beforeAll(async () => {
    const [v] = await db
      .insert(veiculo)
      .values({ marca: 'TOKA QA', modelo: 'Veículo de teste', ano: 2000 })
      .returning({ id: veiculo.id })
    veiculoId = v.id

    const [p1] = await db
      .insert(peca)
      .values({ fabricante: 'TEIN', nome: 'Flex Z', codigo: codigoSuspensao, categoria: 'suspensao' })
      .returning({ id: peca.id })
    pecaSuspensaoId = p1.id

    const [p2] = await db
      .insert(peca)
      .values({ fabricante: 'HKS', nome: 'Turbo GT', codigo: codigoMotor, categoria: 'motor' })
      .returning({ id: peca.id })
    pecaMotorId = p2.id

    await db.insert(instalacao).values([
      { veiculoId, pecaId: pecaSuspensaoId, data: '2024-01-10', km: 1000 },
      { veiculoId, pecaId: pecaMotorId, data: '2023-06-01', km: 500 }
    ])
  })

  afterAll(async () => {
    await db.delete(instalacao).where(eq(instalacao.veiculoId, veiculoId))
    await db.delete(peca).where(inArray(peca.id, [pecaSuspensaoId, pecaMotorId]))
    await db.delete(veiculo).where(eq(veiculo.id, veiculoId))
  })

  it('lista as modificações do veículo com a peça e a categoria (sistema) junto', async () => {
    const resultado = await buscarModificacoesPorVeiculo(veiculoId)

    expect(resultado).toHaveLength(2)
    expect(resultado.map((r) => r.peca.categoria).sort()).toEqual(['motor', 'suspensao'])
    expect(resultado.find((r) => r.peca.categoria === 'suspensao')).toMatchObject({
      peca: { nome: 'Flex Z', fabricante: 'TEIN', codigo: codigoSuspensao }
    })
  })

  it('retorna lista vazia quando o veículo não tem nenhuma modificação', async () => {
    const [semMods] = await db
      .insert(veiculo)
      .values({ marca: 'TOKA QA', modelo: 'Sem modificação', ano: 2000 })
      .returning({ id: veiculo.id })

    const resultado = await buscarModificacoesPorVeiculo(semMods.id)

    expect(resultado).toEqual([])

    await db.delete(veiculo).where(eq(veiculo.id, semMods.id))
  })
})

describe('criarInstalacao', () => {
  let veiculoId: string
  let pecaId: string
  let idsInstalacaoParaLimpar: string[] = []
  const codigoTeste = 'TOKA-TESTE-CRIAR-INST'

  beforeAll(async () => {
    const [v] = await db
      .insert(veiculo)
      .values({ marca: 'TOKA QA', modelo: 'Veículo de teste', ano: 2000, motor: '1.0' })
      .returning({ id: veiculo.id })
    veiculoId = v.id

    const [p] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça pra criar instalação', codigo: codigoTeste, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaId = p.id
  })

  afterAll(async () => {
    await db.delete(instalacao).where(inArray(instalacao.id, idsInstalacaoParaLimpar))
    await db.delete(peca).where(eq(peca.id, pecaId))
    await db.delete(veiculo).where(eq(veiculo.id, veiculoId))
  })

  it('grava só com os campos obrigatórios', async () => {
    const criada = await criarInstalacao({ veiculoId, pecaId, data: '2024-05-01' })
    idsInstalacaoParaLimpar.push(criada.id)

    const [linha] = await db.select().from(instalacao).where(eq(instalacao.id, criada.id))
    expect(linha).toMatchObject({ veiculoId, pecaId, km: null, custo: null, nota: null, compatibilidade: null })
  })

  it('grava custo como string com duas casas — coluna numeric é modo string no drizzle', async () => {
    const criada = await criarInstalacao({
      veiculoId,
      pecaId,
      data: '2024-05-01',
      km: 45000,
      custo: 890.5,
      oficina: 'Oficina do Zé',
      nota: 5,
      oQueDeuErrado: 'Nada até agora',
      compatibilidade: 'direto'
    })
    idsInstalacaoParaLimpar.push(criada.id)

    const [linha] = await db.select().from(instalacao).where(eq(instalacao.id, criada.id))
    expect(linha).toMatchObject({
      km: 45000,
      custo: '890.50',
      oficina: 'Oficina do Zé',
      nota: 5,
      oQueDeuErrado: 'Nada até agora',
      compatibilidade: 'direto'
    })
  })
})

describe('buscarInstalacoesRecentes', () => {
  let veiculoId: string
  let pecaId: string
  let instalacaoId: string
  let usuarioId: string
  const codigoTeste = 'TOKA-TESTE-FEED-A1'

  beforeAll(async () => {
    const [v] = await db
      .insert(veiculo)
      .values({ marca: 'Honda', modelo: 'Civic', ano: 2018, motor: '2.0', dono: 'fulano.feed' })
      .returning({ id: veiculo.id })
    veiculoId = v.id

    const [p] = await db
      .insert(peca)
      .values({ fabricante: 'TOKA QA', nome: 'Peça do feed', codigo: codigoTeste, categoria: 'teste' })
      .returning({ id: peca.id })
    pecaId = p.id

    const [i] = await db
      .insert(instalacao)
      .values({ veiculoId, pecaId, data: '2024-01-10', oQueDeuErrado: 'Rangeu depois de 8 meses' })
      .returning({ id: instalacao.id })
    instalacaoId = i.id

    const [u] = await db.insert(usuario).values({ nome: 'Curtidor do Feed' }).returning({ id: usuario.id })
    usuarioId = u.id
    await curtir(usuarioId, instalacaoId)
  })

  afterAll(async () => {
    await db.delete(curtida).where(eq(curtida.usuarioId, usuarioId))
    await db.delete(usuario).where(eq(usuario.id, usuarioId))
    await db.delete(instalacao).where(eq(instalacao.id, instalacaoId))
    await db.delete(peca).where(eq(peca.id, pecaId))
    await db.delete(veiculo).where(eq(veiculo.id, veiculoId))
  })

  it('traz a peça e o veículo junto, com a contagem de curtidas', async () => {
    const resultado = await buscarInstalacoesRecentes(30)
    const post = resultado.find((r) => r.id === instalacaoId)!

    expect(post).toMatchObject({
      oQueDeuErrado: 'Rangeu depois de 8 meses',
      peca: { fabricante: 'TOKA QA', nome: 'Peça do feed', codigo: codigoTeste },
      veiculo: { marca: 'Honda', modelo: 'Civic', dono: 'fulano.feed' },
      curtidas: 1
    })
  })

  it('diz que o usuário logado já curtiu quando ele passa o id', async () => {
    const resultado = await buscarInstalacoesRecentes(30, usuarioId)
    const post = resultado.find((r) => r.id === instalacaoId)!

    expect(post.curtidoPorMim).toBe(true)
  })

  it('sem usuário logado, curtidoPorMim vem falso pra todo mundo', async () => {
    const resultado = await buscarInstalacoesRecentes(30)
    const post = resultado.find((r) => r.id === instalacaoId)!

    expect(post.curtidoPorMim).toBe(false)
  })

  it('respeita o limite pedido', async () => {
    const resultado = await buscarInstalacoesRecentes(1)
    expect(resultado).toHaveLength(1)
  })
})
