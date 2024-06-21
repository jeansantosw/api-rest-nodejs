import 'dotenv/config'
import knex, { Knex } from 'knex'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found')
}

export const configKnex: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: process.env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
}

export const setupKnex = knex(configKnex)
