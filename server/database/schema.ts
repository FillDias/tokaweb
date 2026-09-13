import {
  pgTable, uuid, text, integer, smallint, date,
  numeric, timestamp, uniqueIndex
} from 'drizzle-orm/pg-core'

export const veiculo = pgTable('veiculo', {
  id:        uuid('id').primaryKey().defaultRandom(),
  marca:     text('marca').notNull(),
  modelo:    text('modelo').notNull(),
  ano:       integer('ano').notNull(),
  motor:     text('motor'),
  kmAtual:   integer('km_atual'),
  dono:      text('dono'),
  criadoEm:  timestamp('criado_em', { withTimezone: true }).notNull().defaultNow()
})

export const peca = pgTable('peca', {
  id:         uuid('id').primaryKey().defaultRandom(),
  fabricante: text('fabricante').notNull(),
  nome:       text('nome').notNull(),
  codigo:     text('codigo').notNull().unique(),
  categoria:  text('categoria').notNull(),
  codigoNorm: text('codigo_norm'),
  criadoEm:   timestamp('criado_em', { withTimezone: true }).notNull().defaultNow()
})

// email pode ser nulo: Line só devolve email com escopo aprovado no
// console deles, nem sempre disponível — ver CONTEXT.md
export const usuario = pgTable('usuario', {
  id:        uuid('id').primaryKey().defaultRandom(),
  email:     text('email'),
  nome:      text('nome'),
  avatarUrl: text('avatar_url'),
  criadoEm:  timestamp('criado_em', { withTimezone: true }).notNull().defaultNow()
})

// uma conta por provedor vinculado (google, line, apple, ...); um
// usuario pode ter várias. Login novo sem conta existente cria um
// usuario novo — não tenta casar por email (provedores diferentes
// podem não devolver o mesmo email, ou nenhum)
export const conta = pgTable('conta', {
  id:         uuid('id').primaryKey().defaultRandom(),
  usuarioId:  uuid('usuario_id').notNull().references(() => usuario.id),
  provedor:   text('provedor').notNull(),
  idExterno:  text('id_externo').notNull(),
  criadoEm:   timestamp('criado_em', { withTimezone: true }).notNull().defaultNow()
}, (t) => [
  uniqueIndex('conta_provedor_id_externo_unico').on(t.provedor, t.idExterno)
])

export const instalacao = pgTable('instalacao', {
  id:              uuid('id').primaryKey().defaultRandom(),
  veiculoId:       uuid('veiculo_id').notNull().references(() => veiculo.id),
  pecaId:          uuid('peca_id').notNull().references(() => peca.id),
  data:            date('data').notNull(),
  km:              integer('km'),
  custo:           numeric('custo', { precision: 10, scale: 2 }),
  oficina:         text('oficina'),
  nota:            smallint('nota'),
  oQueDeuErrado:   text('o_que_deu_errado'),
  compatibilidade: text('compatibilidade'),
  criadoEm:        timestamp('criado_em', { withTimezone: true }).notNull().defaultNow()
})