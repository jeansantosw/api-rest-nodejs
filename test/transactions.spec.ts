import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('shuld be able to create a new transactions', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New Transaction',
      amount: 10000,
      type: 'credit',
    })
    expect(response.statusCode).toEqual(201)
  })

  it('shuld be able to list all transactions', async () => {
    const createTransactionsResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 10000,
        type: 'credit',
      })

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const cookies = createTransactionsResponse.get('Set-Cookie')!

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New Transaction',
        amount: 10000,
      }),
    ])
  })

  it('shuld be able to get a specific transactions', async () => {
    const createTransactionsResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 10000,
        type: 'credit',
      })

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const cookies = createTransactionsResponse.get('Set-Cookie')!

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionsId = listTransactionsResponse.body.transactions[0].id

    const getTransactionsResponse = await request(app.server)
      .get(`/transactions/${transactionsId}`)
      .set('Cookie', cookies)
      .expect(200)

    console.log('transactionsId: ', getTransactionsResponse.body.transaction)

    expect(getTransactionsResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New Transaction',
        amount: 10000,
      }),
    )
  })

  it('shuld be able to get the summary', async () => {
    const createTransactionsResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 6000,
        type: 'credit',
      })

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const cookies = createTransactionsResponse.get('Set-Cookie')!

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit Tansactions',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    console.log('summaryResponse.body.summary: ', summaryResponse.body.summary)

    expect(summaryResponse.body.summary).toEqual({
      amount: 4000,
    })
  })
})
