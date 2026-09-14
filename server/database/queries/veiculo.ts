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
