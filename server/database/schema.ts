import {
  pgTable, uuid, text, integer, smallint, date,
  numeric, timestamp, uniqueIndex, boolean
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
// console deles, nem sempre disponível — ver CONTEXT.md.
// cep/telefone só vêm preenchidos no cadastro manual; quem entra por
// provedor social fica sem, daí a faixa de completar perfil
export const usuario = pgTable('usuario', {
  id:                        uuid('id').primaryKey().defaultRandom(),
  email:                     text('email'),
  nome:                      text('nome'),
  avatarUrl:                 text('avatar_url'),
  cep:                       text('cep'),
  telefone:                  text('telefone'),
  perfilLembreteDispensado:  boolean('perfil_lembrete_dispensado').notNull().default(false),
  // confirmação por email: esqueleto pronto, desligado por env var
  // (mesmo padrão do Apple) — ver CONTEXT.md
  emailConfirmadoEm:         timestamp('email_confirmado_em', { withTimezone: true }),
  tokenConfirmacaoEmail:     text('token_confirmacao_email'),
  tokenConfirmacaoExpiraEm:  timestamp('token_confirmacao_expira_em', { withTimezone: true }),
  criadoEm:                  timestamp('criado_em', { withTimezone: true }).notNull().defaultNow()
})

// uma conta por provedor vinculado (google, line, apple, email, ...);
// um usuario pode ter várias. Login novo sem conta existente cria um
// usuario novo — não tenta casar por email (provedores diferentes
// podem não devolver o mesmo email, ou nenhum). senhaHash só existe
// quando provedor = 'email' (cadastro manual); idExterno nesse caso
// é o próprio email
export const conta = pgTable('conta', {
  id:         uuid('id').primaryKey().defaultRandom(),
  usuarioId:  uuid('usuario_id').notNull().references(() => usuario.id),
  provedor:   text('provedor').notNull(),
  idExterno:  text('id_externo').notNull(),
  senhaHash:  text('senha_hash'),
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

// nunca o binário no banco — só a chave do objeto no MinIO (etapa 6
// vai somar anuncioId nulável quando classificados existir; hoje só
// instalação tem foto). Ver PROJETO.md 3.2 e server/utils/armazenamento.ts
export const foto = pgTable('foto', {
  id:           uuid('id').primaryKey().defaultRandom(),
  instalacaoId: uuid('instalacao_id').notNull().references(() => instalacao.id),
  chave:        text('chave').notNull(),
  criadoEm:     timestamp('criado_em', { withTimezone: true }).notNull().defaultNow()
})

// primeiro vínculo real entre usuario e instalacao — sinal de "relato
// útil" (ver CONTEXT.md). Único por par: não deixa curtir duas vezes
export const curtida = pgTable('curtida', {
  id:           uuid('id').primaryKey().defaultRandom(),
  usuarioId:    uuid('usuario_id').notNull().references(() => usuario.id),
  instalacaoId: uuid('instalacao_id').notNull().references(() => instalacao.id),
  criadoEm:     timestamp('criado_em', { withTimezone: true }).notNull().defaultNow()
}, (t) => [
  uniqueIndex('curtida_usuario_instalacao_unico').on(t.usuarioId, t.instalacaoId)
])