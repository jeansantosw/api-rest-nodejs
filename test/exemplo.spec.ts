import { expect, test, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})
console.log('teste')
test('use can create a new transactions', async () => {
  const response = await request(app.server).post('/transactions').send({
    title: 'New Transaction',
    amount: 10000,
    type: 'credit',
  })
  expect(response.statusCode).toEqual(201)
})
