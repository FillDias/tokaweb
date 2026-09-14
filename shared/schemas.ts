import { z } from 'zod'

export const senha = z.string().min(8, 'A senha precisa de pelo menos 8 caracteres')
const cep = z
  .string()
  .regex(/^\d{5}-?\d{3}$/, 'CEP inválido — use o formato 00000-000')
const telefone = z
  .string()
  .regex(/^\+?\d{10,13}$/, 'Telefone inválido — use DDD + número, só dígitos')

export const cadastroManualSchema = z
  .object({
    email: z.string().email('Email inválido'),
    senha,
    confirmarSenha: z.string(),
    cep,
    telefone
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: 'As senhas não são iguais',
    path: ['confirmarSenha']
  })

export type CadastroManual = z.infer<typeof cadastroManualSchema>

export const loginManualSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Digite a senha')
})

export type LoginManual = z.infer<typeof loginManualSchema>

export const completarPerfilSchema = z.object({
  cep,
  telefone
})

export type CompletarPerfil = z.infer<typeof completarPerfilSchema>

// "Criar senha" em Minha conta — vincula o provedor `email` a uma
// conta que só tinha login social. Mesma regra de senha do cadastro
// manual, sem pedir email de novo (já é o do usuário logado)
export const criarSenhaSchema = z
  .object({ senha, confirmarSenha: z.string() })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: 'As senhas não são iguais',
    path: ['confirmarSenha']
  })

export type CriarSenha = z.infer<typeof criarSenhaSchema>

// formulário HTML manda campo vazio como string vazia, não ausente —
// sem normalizar, um número opcional em branco vira 0 (Number('') é
// 0) e um select em branco falha a validação do enum
function vazioParaIndefinido(valor: unknown) {
  return valor === '' || valor === null ? undefined : valor
}

const km = z.preprocess(
  vazioParaIndefinido,
  z.coerce.number('Quilometragem inválida').int('Quilometragem inválida').nonnegative('Quilometragem inválida').optional()
)

const custo = z.preprocess(vazioParaIndefinido, z.coerce.number('Custo inválido').nonnegative('Custo inválido').optional())

const nota = z.preprocess(
  vazioParaIndefinido,
  z.coerce.number('Nota inválida').int('Nota inválida').min(1, 'Nota de 1 a 5').max(5, 'Nota de 1 a 5').optional()
)

// nunca 'sem_dados' aqui — esse estado é derivado da ausência de
// relato, não algo que a própria instalação declara. Ver
// "compatibilidade observada" em CONTEXT.md
const compatibilidade = z.preprocess(vazioParaIndefinido, z.enum(['direto', 'adaptacao', 'nao_serve']).optional())

// o formulário não sabe o veiculoId de antemão — a pessoa digita
// marca/modelo/ano/motor e o servidor busca um veiculo existente com
// esses dados ou cria um na hora (ver "Como o formulário de
// instalação escolhe o veiculoId" em CONTEXT.md)
export const veiculoSchema = z.object({
  marca: z.string().trim().min(1, 'Marca obrigatória'),
  modelo: z.string().trim().min(1, 'Modelo obrigatório'),
  ano: z.coerce
    .number('Ano inválido')
    .int('Ano inválido')
    .min(1900, 'Ano inválido')
    .max(new Date().getFullYear() + 1, 'Ano inválido'),
  motor: z.string().trim().min(1, 'Motor obrigatório')
})

export type VeiculoDados = z.infer<typeof veiculoSchema>

export const instalacaoSchema = veiculoSchema.extend({
  pecaId: z.uuid('Peça inválida'),
  data: z.iso
    .date('Data inválida')
    .refine((valor) => valor <= new Date().toISOString().slice(0, 10), 'A data não pode ser no futuro'),
  km,
  custo,
  oficina: z.string().trim().max(120, 'Nome da oficina muito longo').optional(),
  nota,
  oQueDeuErrado: z.string().trim().max(2000, 'Relato muito longo').optional(),
  compatibilidade
})

export type Instalacao = z.infer<typeof instalacaoSchema>
