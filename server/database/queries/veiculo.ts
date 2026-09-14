import { and, eq, isNotNull } from 'drizzle-orm'
import { db, veiculo } from '~~/server/database'

export async function listarMarcas(): Promise<string[]> {
  const linhas = await db.selectDistinct({ marca: veiculo.marca }).from(veiculo).orderBy(veiculo.marca)
  return linhas.map((l) => l.marca)
}

export async function listarModelos(marca: string): Promise<string[]> {
  const linhas = await db
    .selectDistinct({ modelo: veiculo.modelo })
    .from(veiculo)
    .where(eq(veiculo.marca, marca))
    .orderBy(veiculo.modelo)
  return linhas.map((l) => l.modelo)
}

export async function listarAnos(marca: string, modelo: string): Promise<number[]> {
  const linhas = await db
    .selectDistinct({ ano: veiculo.ano })
    .from(veiculo)
    .where(and(eq(veiculo.marca, marca), eq(veiculo.modelo, modelo)))
    .orderBy(veiculo.ano)
  return linhas.map((l) => l.ano)
}

export async function listarMotores(marca: string, modelo: string, ano: number): Promise<string[]> {
  const linhas = await db
    .selectDistinct({ motor: veiculo.motor })
    .from(veiculo)
    .where(and(eq(veiculo.marca, marca), eq(veiculo.modelo, modelo), eq(veiculo.ano, ano), isNotNull(veiculo.motor)))
    .orderBy(veiculo.motor)
  return linhas.map((l) => l.motor as string)
}

// usada por POST /api/instalacao — o formulário nunca conhece o
// veiculo.id de antemão, só marca/modelo/ano/motor. Acha um veiculo
// existente com esses dados exatos ou cria um na hora. Ver "garagem"
// em CONTEXT.md: veiculo não tem vínculo com usuario, então qualquer
// combinação nova vira um veiculo novo
export async function buscarOuCriarVeiculo(dados: { marca: string; modelo: string; ano: number; motor: string }) {
  const [existente] = await db
    .select({ id: veiculo.id })
    .from(veiculo)
    .where(
      and(
        eq(veiculo.marca, dados.marca),
        eq(veiculo.modelo, dados.modelo),
        eq(veiculo.ano, dados.ano),
        eq(veiculo.motor, dados.motor)
      )
    )
    .limit(1)

  if (existente) return existente.id

  const [criado] = await db.insert(veiculo).values(dados).returning({ id: veiculo.id })
  return criado.id
}

export async function buscarVeiculoPorId(id: string) {
  const [resultado] = await db
    .select({
      id: veiculo.id,
      marca: veiculo.marca,
      modelo: veiculo.modelo,
      ano: veiculo.ano,
      motor: veiculo.motor,
      kmAtual: veiculo.kmAtual,
      dono: veiculo.dono
    })
    .from(veiculo)
    .where(eq(veiculo.id, id))
    .limit(1)

  return resultado
}
