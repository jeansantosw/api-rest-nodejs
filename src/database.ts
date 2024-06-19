import Knex from 'knex'

export const setupKnex = Knex({
  client: 'sqlite',
  connection: {
    filename: './tmp/app.db',
  },
})
