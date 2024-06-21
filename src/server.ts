import fastify from 'fastify'
import { setupKnex } from './database'
import crypto from 'node:crypto'

const app = fastify()

app.get('/hello', async () => {
  const transactions = await setupKnex('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'Testando rota',
      amount: 1000,
    })
    .returning('*')

  return transactions
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Starting server')
  })
