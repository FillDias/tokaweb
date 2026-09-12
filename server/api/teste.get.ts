import { db, peca } from '~~/server/database'

export default defineEventHandler(async () => {
  const pecas = await db.select().from(peca)
  return pecas
})
